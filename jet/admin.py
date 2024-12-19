from django.contrib import admin

from django.contrib.contenttypes.admin import GenericInlineModelAdminChecks
from functools import partial
from django.contrib.admin.options import InlineModelAdmin, flatten_fieldsets
from django.contrib.contenttypes.forms import BaseGenericInlineFormSet
from django.forms import ALL_FIELDS
from django.forms.models import modelform_defines_fields

from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.forms import ModelForm, modelformset_factory


def generic_inlineformset_factory(model, form=ModelForm,
                                  formset=BaseGenericInlineFormSet,
                                  ct_field="content_type", fk_field="object_id",
                                  fields=None, exclude=None,
                                  extra=3, can_order=False, can_delete=True,
                                  max_num=None, formfield_callback=None,
                                  validate_max=False, for_concrete_model=True,
                                  min_num=None, validate_min=False,
                                  absolute_max=None, can_delete_extra=True,
                                  widgets=None):
    """
    Return a ``GenericInlineFormSet`` for the given kwargs.
    You must provide ``ct_field`` and ``fk_field`` if they are different from
    the defaults ``content_type`` and ``object_id`` respectively.
    Adds widgets as an optional argument.
    """
    opts = model._meta
    # if there is no field called `ct_field` let the exception propagate
    ct_field = opts.get_field(ct_field)
    if not isinstance(ct_field, models.ForeignKey) or ct_field.remote_field.model != ContentType:
        raise Exception("fk_name '%s' is not a ForeignKey to ContentType" % ct_field)
    fk_field = opts.get_field(fk_field)  # let the exception propagate
    exclude = [*(exclude or []), ct_field.name, fk_field.name]
    FormSet = modelformset_factory(
        model, form=form, formfield_callback=formfield_callback,
        formset=formset, extra=extra, can_delete=can_delete,
        can_order=can_order, fields=fields, exclude=exclude, max_num=max_num,
        validate_max=validate_max, min_num=min_num, validate_min=validate_min,
        absolute_max=absolute_max, can_delete_extra=can_delete_extra,
        widgets=widgets
    )
    FormSet.ct_field = ct_field
    FormSet.ct_fk_field = fk_field
    FormSet.for_concrete_model = for_concrete_model
    return FormSet


class GenericInlineModelAdmin(InlineModelAdmin):
    '''
    Override GenericInlineModelAdmin to use our custom
    generic_inlineformset_factory function that allows to pass
    widgets as an argument.
    '''

    ct_field = "content_type"
    ct_fk_field = "object_id"
    formset = BaseGenericInlineFormSet

    checks_class = GenericInlineModelAdminChecks

    def get_formset(self, request, obj=None, **kwargs):
        if 'fields' in kwargs:
            fields = kwargs.pop('fields')
        else:
            fields = flatten_fieldsets(self.get_fieldsets(request, obj))
        exclude = [*(self.exclude or []), *self.get_readonly_fields(request, obj)]
        if self.exclude is None and hasattr(self.form, '_meta') and self.form._meta.exclude:
            # Take the custom ModelForm's Meta.exclude into account only if the
            # GenericInlineModelAdmin doesn't define its own.
            exclude.extend(self.form._meta.exclude)
        exclude = exclude or None
        can_delete = self.can_delete and self.has_delete_permission(request, obj)
        defaults = {
            'ct_field': self.ct_field,
            'fk_field': self.ct_fk_field,
            'form': self.form,
            'formfield_callback': partial(self.formfield_for_dbfield, request=request),
            'formset': self.formset,
            'extra': self.get_extra(request, obj),
            'can_delete': can_delete,
            'can_order': False,
            'fields': fields,
            'min_num': self.get_min_num(request, obj),
            'max_num': self.get_max_num(request, obj),
            'exclude': exclude,
            **kwargs,
        }

        if defaults['fields'] is None and not modelform_defines_fields(defaults['form']):
            defaults['fields'] = ALL_FIELDS

        return generic_inlineformset_factory(self.model, **defaults)


class CompactInline(admin.options.InlineModelAdmin):
    template = 'admin/edit_inline/compact.html'

class GenericCompactInline(GenericInlineModelAdmin):
    template = 'admin/edit_inline/compact.html'
