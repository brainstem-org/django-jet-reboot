var $ = require('jquery');

var ToolbarUpdater = function($changelist) {
    this.$changelist = $changelist;
};

ToolbarUpdater.prototype = {
    getDiv: function($parentDiv, $childDiv) {
        var $element = $('#'+$parentDiv).find('#'+$childDiv);

        if ($element.length == 0) {
            $element = $('<div>').attr('id', $childDiv);
            $('#'+$parentDiv).prepend($element);
        }

        return $element;
    },
    addSearchPlaceholder: function($toolbar) {
        var placeholder = $toolbar.find('input[type="submit"]').val();
        $toolbar.find('#searchbar').attr('placeholder', placeholder);
    },
    convertFilters: function($changelist, $toolbar) {
        var filterName;
        var filterNameTrimmed;
        var $search = $toolbar.find("input[type='submit']");

        $changelist.find('#changelist-filter').children().each(function() {
            var $element = $(this);

            if ($element.prop('tagName') != 'H3') {
                if (filterNameTrimmed=='by-created-at' || filterNameTrimmed=='by-updated-at' ) {
                    return;
                }
            }

            if ($element.prop('tagName') == 'H3') {
                filterName = $element.text();
                filterNameTrimmed = filterName.trim().toLowerCase().replace(/[^a-zA-Z0-9] /g, '').replace(/ /g, '-');

            } else if ($element.prop('tagName') == 'UL') {
                var $select = $('<select>');
                var $items = $element.find('li');

                $.each($element.prop('attributes'), function() {
                    $select.attr(this.name, this.value);
                });

                $select.addClass('changelist-filter-select');

                if ($items.filter('.selected').length > 1) {
                    $select.attr('multiple', true);
                }

                $items.each(function(i) {
                    var $item = $(this);
                    var $link = $item.find('a');
                    var $option = $('<option>')
                        .text($link.text())
                        .attr('data-url', $link.attr('href'))
                        .attr('selected', $item.hasClass('selected'));

                    if (i == 0 ) {
                        if (filterName != null) {
                            $option.text(filterName)
                        }

                        var $separator = $('<option>')
                            .attr('disabled', true)
                            .text('---');

                        $option = $option.add($separator);
                    }

                    $select.append($option);
                });

                var $wrapper = $('<span>')
                    .addClass('changelist-filter-select-wrapper')
                    .append($select)
                    .attr('id', filterNameTrimmed);

                if ($search.length) {
                    $wrapper.insertAfter($search);
                } else {
                    $toolbar.append($wrapper);
                }

                filterName = null;
            } else if ($element.hasClass('changelist-filter-popup')) {
                var $toggle = $element.find('.changelist-filter-popup-toggle');
                var $content = $element.find('.changelist-filter-popup-content');
                var $wrapper = $('<span>')
                    .addClass('changelist-filter-select-wrapper')
                    .append($element);

                if ($search.length) {
                    $wrapper.insertAfter($search);
                } else {
                    $toolbar.append($wrapper);
                }

                $toggle.on('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $content.toggleClass('visible');
                });

                $content.on('click', function(e) {
                    e.stopPropagation();
                });

                $(document.body).on('click', function() {
                    $content.removeClass('visible');
                });
            }

        });

    },
    convertCreateFilter: function($changelist, $toolbar) {
        var filterName;
        var filterNameTrimmed;
        var $search = $toolbar.find('#searchbar');

        $changelist.find('#changelist-filter').children().each(function() {
            var $element = $(this);

            if($element.text() =='Filter') {
                return;
            }
            if ($element.prop('tagName') == 'H3') {
                filterName = $element.text();
                filterNameTrimmed = filterName.trim().toLowerCase().replace(/[^a-zA-Z0-9] /g, '').replace(/ /g, '-');
                if(filterNameTrimmed=='by-created-at') {
                    $element =  $('<h3>Created</h3>');
                }
            }

            if (filterNameTrimmed && filterNameTrimmed.length > 0 && filterNameTrimmed != 'by-created-at' ) {
                return;
            }

            $toolbar.append($element);
            return;
        });
    },
    convertUpdateFilter: function($changelist, $toolbar) {
        var filterName;
        var filterNameTrimmed;
        var $search = $toolbar.find('#searchbar');

        $changelist.find('#changelist-filter').children().each(function() {
            var $element = $(this);

            if($element.text() =='Filter') {
                return;
            }

            if ($element.prop('tagName') == 'H3') {
                filterName = $element.text();
                filterNameTrimmed = filterName.trim().toLowerCase().replace(/[^a-zA-Z0-9] /g, '').replace(/ /g, '-');
                if(filterNameTrimmed=='by-updated-at') {
                    $element =  $('<h3>Updated</h3>');
                }
            }

            if (filterNameTrimmed && filterNameTrimmed.length > 0 && filterNameTrimmed != 'by-updated-at' ) {
                return;
            }

            $toolbar.append($element);
            return;
        });
    },
    convertDateFilters: function($changelist, $toolbar) {
        var filterName;
        var filterNameTrimmed;
        var $search = $toolbar.find('#searchbar');

        $changelist.find('#changelist-filter').children().each(function() {
            var $element = $(this);

            if ($element.prop('tagName') == 'H3') {
                filterName = $element.text();
                filterNameTrimmed = filterName.trim().toLowerCase().replace(/[^a-zA-Z0-9] /g, '').replace(/ /g, '-');
                if(filterNameTrimmed=='by-created-at') {
                    $element =  $('<h3>Created</h3>');
                }
                if(filterNameTrimmed=='by-updated-at') {
                    $element =  $('<h3>Updated</h3>');
                }
            }

            if (filterNameTrimmed && filterNameTrimmed.length > 0 && filterNameTrimmed != 'by-created-at' && filterNameTrimmed != 'by-updated-at' ) {
                return;
            }

            $toolbar.append($element);
            return;

            if ($element.prop('tagName') == 'H3') {
                filterName = $element.text();
                filterNameTrimmed = filterName.trim().toLowerCase().replace(/[^a-zA-Z0-9] /g, '').replace(/ /g, '-');

            } else if ($element.prop('tagName') == 'UL') {
                var $select = $('<select>');
                var $items = $element.find('li');

                $.each($element.prop('attributes'), function() {
                    $select.attr(this.name, this.value);
                });

                $select.addClass('changelist-filter-select');

                if ($items.filter('.selected').length > 1) {
                    $select.attr('multiple', true);
                }

                $items.each(function(i) {
                    var $item = $(this);
                    var $link = $item.find('a');
                    var $option = $('<option>')
                        .text($link.text())
                        .attr('data-url', $link.attr('href'))
                        .attr('selected', $item.hasClass('selected'));

                    if (i == 0 ) {
                        if (filterName != null) {
                            $option.text(filterName)
                        }

                        var $separator = $('<option>')
                            .attr('disabled', true)
                            .text('---');

                        $option = $option.add($separator);
                    }

                    $select.append($option);
                });

                var $wrapper = $('<span>')
                    .addClass('changelist-filter-select-wrapper')
                    .append($select)
                    .attr('id', filterNameTrimmed);

                if ($search.length) {
                    $wrapper.insertAfter($search);
                } else {
                    $toolbar.append($wrapper);
                }

                filterName = null;
            } else if ($element.hasClass('changelist-filter-popup')) {
                var $toggle = $element.find('.changelist-filter-popup-toggle');
                var $content = $element.find('.changelist-filter-popup-content');
                var $wrapper = $('<span>')
                    .addClass('changelist-filter-select-wrapper')
                    .append($element);

                if ($search.length) {
                    $wrapper.insertAfter($search);
                } else {
                    $toolbar.append($wrapper);
                }

                $toggle.on('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $content.toggleClass('visible');
                });

                $content.on('click', function(e) {
                    e.stopPropagation();
                });

                $(document.body).on('click', function() {
                    $content.removeClass('visible');
                });
            }

        });


    },
    fixFloatLineBreak: function() {
        $('#content-main').each(function() {
            var $content = $(this);

            $.each(['#toolbar', '.object-tools', 'changeform-navigation'], function(i, selector) {
                var $element = $content.find(selector).first();

                if ($element.length == 0) {
                    return;
                }

                $('<div>')
                    .addClass('clear')
                    .insertAfter($element);

                return false;
            });
        });
    },
    moveObjectTools: function($objectTools, $section) {
        const $items = $objectTools.find('li');
    },

    run: function() {
        const $filtersLine1 = this.getDiv('list-view__header__top', 'filters-line-1');
        const $createdFilters = this.getDiv('filters-line-1', 'created-filter');
        const $updatedFilters = this.getDiv('filters-line-1', 'updated-filter');
        const $rightBlock = this.getDiv('filters-line-1', 'right-block');
        const $toolbar = this.getDiv('filters-line-2', 'toolbar');
        const $objectTools = $(".object-tools");

        try {

            // Line 1 Filters
            this.convertCreateFilter(this.$changelist, $createdFilters);
            this.convertUpdateFilter(this.$changelist, $updatedFilters);
            this.moveObjectTools($objectTools, $rightBlock);

            // Line 2 Filters (shared/templates/admin/change_list.html specifies that #toolbar is inside #filters-line-2
            this.addSearchPlaceholder($toolbar);
            this.convertFilters(this.$changelist, $toolbar);
            this.$changelist.find('#changelist-filter').remove();

        } catch (e) {
            console.error(e, e.stack);
        }

        try {
            this.fixFloatLineBreak();
        } catch (e) {
            console.error(e, e.stack);
        }

        $createdFilters.addClass('initialized');
        $updatedFilters.addClass('initialized');
        $rightBlock.addClass('initialized');
        $toolbar.addClass('initialized');
    }
};

$(document).ready(function() {
    $('#changelist').each(function() {
        new ToolbarUpdater($(this)).run();
    });
});
