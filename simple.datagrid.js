// Generated by CoffeeScript 1.6.1

/*
Copyright 2012 Marco Braak

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/


(function() {
  var $, SimpleDataGrid, SimpleWidget, SortOrder, max, min, parseQueryParameters, parseUrl, range, slugify,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $ = this.jQuery;

  SimpleWidget = (function() {

    SimpleWidget.prototype.defaults = {};

    function SimpleWidget(el, options) {
      this.$el = $(el);
      this.options = $.extend({}, this.defaults, options);
    }

    SimpleWidget.prototype.destroy = function() {
      return this._deinit();
    };

    SimpleWidget.prototype._init = function() {
      return null;
    };

    SimpleWidget.prototype._deinit = function() {
      return null;
    };

    SimpleWidget.register = function(widget_class, widget_name) {
      var callFunction, createWidget, destroyWidget, getDataKey;
      getDataKey = function() {
        return "simple_widget_" + widget_name;
      };
      createWidget = function($el, options) {
        var data_key, el, widget, _i, _len;
        data_key = getDataKey();
        for (_i = 0, _len = $el.length; _i < _len; _i++) {
          el = $el[_i];
          widget = new widget_class(el, options);
          if (!$.data(el, data_key)) {
            $.data(el, data_key, widget);
          }
          widget._init();
        }
        return $el;
      };
      destroyWidget = function($el) {
        var data_key, el, widget, _i, _len, _results;
        data_key = getDataKey();
        _results = [];
        for (_i = 0, _len = $el.length; _i < _len; _i++) {
          el = $el[_i];
          widget = $.data(el, data_key);
          if (widget && (widget instanceof SimpleWidget)) {
            widget.destroy();
          }
          _results.push($.removeData(el, data_key));
        }
        return _results;
      };
      callFunction = function($el, function_name, args) {
        var el, result, widget, widget_function, _i, _len;
        result = null;
        for (_i = 0, _len = $el.length; _i < _len; _i++) {
          el = $el[_i];
          widget = $.data(el, getDataKey());
          if (widget && (widget instanceof SimpleWidget)) {
            widget_function = widget[function_name];
            if (widget_function && (typeof widget_function === 'function')) {
              result = widget_function.apply(widget, args);
            }
          }
        }
        return result;
      };
      return $.fn[widget_name] = function() {
        var $el, args, argument1, function_name, options;
        argument1 = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        $el = this;
        if (argument1 === void 0 || typeof argument1 === 'object') {
          options = argument1;
          return createWidget($el, options);
        } else if (typeof argument1 === 'string' && argument1[0] !== '_') {
          function_name = argument1;
          if (function_name === 'destroy') {
            return destroyWidget($el);
          } else {
            return callFunction($el, function_name, args);
          }
        }
      };
    };

    return SimpleWidget;

  })();

  this.SimpleWidget = SimpleWidget;

  /*
  Copyright 2012 Marco Braak
  
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  
      http://www.apache.org/licenses/LICENSE-2.0
  
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  */


  $ = this.jQuery;

  SimpleWidget = this.SimpleWidget;

  min = function(value1, value2) {
    if (value1 < value2) {
      return value1;
    } else {
      return value2;
    }
  };

  max = function(value1, value2) {
    if (value1 > value2) {
      return value1;
    } else {
      return value2;
    }
  };

  range = function(start, stop) {
    var array, i, len;
    len = stop - start;
    array = new Array(len);
    i = 0;
    while (i < len) {
      array[i] = start;
      start += 1;
      i += 1;
    }
    return array;
  };

  SimpleDataGrid = (function(_super) {

    __extends(SimpleDataGrid, _super);

    function SimpleDataGrid() {
      return SimpleDataGrid.__super__.constructor.apply(this, arguments);
    }

    SimpleDataGrid.prototype.defaults = {
      order_by: null,
      url: null,
      data: null,
      paginator: null,
      on_generate_tr: null,
      on_generate_footer: null
    };

    SimpleDataGrid.prototype.loadData = function(data) {
      return this._fillGrid(data);
    };

    SimpleDataGrid.prototype.getColumns = function() {
      return this.columns;
    };

    SimpleDataGrid.prototype.getSelectedRow = function() {
      if (this.$selected_row) {
        return this.$selected_row.data('row');
      } else {
        return null;
      }
    };

    SimpleDataGrid.prototype.reload = function() {
      return this._loadData();
    };

    SimpleDataGrid.prototype.setParameter = function(key, value) {
      return this.parameters[key] = value;
    };

    SimpleDataGrid.prototype.setCurrentPage = function(page) {
      return this.current_page = page;
    };

    SimpleDataGrid.prototype.addColumn = function(column, index) {
      var column_info;
      column_info = this._createColumnInfo(column);
      if (index != null) {
        this.columns.splice(index, 0, column_info);
      } else {
        this.columns.push(column_info);
      }
      return column_info;
    };

    SimpleDataGrid.prototype.removeColumn = function(column_key) {
      var column_index, getColumnIndex,
        _this = this;
      getColumnIndex = function() {
        var column, i, _i, _len, _ref;
        _ref = _this.columns;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          column = _ref[i];
          if (column.key === column_key) {
            return i;
          }
        }
        return null;
      };
      column_index = getColumnIndex();
      if (column_index !== null) {
        return this.columns.splice(column_index, 1);
      }
    };

    SimpleDataGrid.prototype.url = function(value) {
      if (value) {
        this._url = value;
      }
      return this._url;
    };

    SimpleDataGrid.prototype._init = function() {
      SimpleDataGrid.__super__._init.call(this);
      this._url = this._getBaseUrl();
      this.$selected_row = null;
      this.current_page = 1;
      this.parameters = {};
      this.order_by = this._parseOrderByOption();
      this.sort_order = this._parseSortorderOption() || SortOrder.ASCENDING;
      this._generateColumnData();
      this._createDomElements();
      this._bindEvents();
      return this._loadData();
    };

    SimpleDataGrid.prototype._deinit = function() {
      this._removeDomElements();
      this._removeEvents();
      this.columns = [];
      this.options = {};
      this.parameters = {};
      this.order_by = null;
      this.sort_order = null;
      this.$selected_row = null;
      this.current_page = 1;
      this._url = null;
      return SimpleDataGrid.__super__._deinit.call(this);
    };

    SimpleDataGrid.prototype._getBaseUrl = function() {
      var url;
      url = this.options.url;
      if (url) {
        return url;
      } else {
        return this.$el.data('url');
      }
    };

    SimpleDataGrid.prototype._generateColumnData = function() {
      var addColumn, column_map, generateFromOptions, generateFromThElements,
        _this = this;
      column_map = {};
      addColumn = function(info) {
        _this.columns.push(info);
        return column_map[info.key] = info;
      };
      generateFromThElements = function() {
        var $th_elements;
        $th_elements = _this.$el.find('th');
        return $th_elements.each(function(i, th) {
          var $th, key, title;
          $th = $(th);
          title = $th.text();
          key = $th.data('key') || slugify(title);
          return addColumn({
            title: title,
            key: key
          });
        });
      };
      generateFromOptions = function() {
        var column, column_info, key, _i, _len, _ref;
        _ref = _this.options.columns;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          column = _ref[_i];
          column_info = null;
          if (typeof column === 'object') {
            if ('key' in column) {
              key = column.key;
              if (typeof key === 'string') {
                column_info = column_map[key];
              } else {
                column_info = _this.columns[key];
              }
            }
          }
          if (column_info) {
            _this._updateColumnInfo(column_info, column);
          } else {
            column_info = _this._createColumnInfo(column);
            if (column_info) {
              addColumn(column_info);
            }
          }
        }
        return null;
      };
      this.columns = [];
      generateFromThElements();
      if (this.options.columns) {
        return generateFromOptions();
      }
    };

    SimpleDataGrid.prototype._createColumnInfo = function(column) {
      if (typeof column === 'object') {
        if (!(column.title || column.key)) {
          return null;
        } else {
          return {
            title: column.title,
            key: column.key || slugify(column.title),
            on_generate: column.on_generate
          };
        }
      } else {
        return {
          title: column,
          key: slugify(column)
        };
      }
    };

    SimpleDataGrid.prototype._updateColumnInfo = function(column_info, column) {
      if (column.title) {
        column_info.title = column.title;
      }
      if (column.on_generate) {
        return column_info.on_generate = column.on_generate;
      }
    };

    SimpleDataGrid.prototype._parseOrderByOption = function() {
      var order_by, order_by_from_data, order_by_from_options;
      order_by_from_options = this.options.order_by;
      order_by_from_data = this.$el.data('order-by');
      order_by = !!(order_by_from_options || order_by_from_data);
      if (typeof order_by_from_data === 'string') {
        order_by = order_by_from_data;
      }
      if (typeof order_by_from_options === 'string') {
        order_by = order_by_from_options;
      }
      return order_by;
    };

    SimpleDataGrid.prototype._parseSortorderOption = function() {
      var sortorder, sortorder_from_data, sortorder_from_options;
      sortorder_from_options = this.options.sortorder;
      sortorder_from_data = this.$el.data('sortorder');
      sortorder = sortorder_from_options || sortorder_from_data;
      if (sortorder === 'asc') {
        return SortOrder.ASCENDING;
      } else if (sortorder === 'desc') {
        return SortOrder.DESCENDING;
      } else {
        return false;
      }
    };

    SimpleDataGrid.prototype._createDomElements = function() {
      var initBody, initFoot, initHead, initTable,
        _this = this;
      initTable = function() {
        return _this.$el.addClass('simple-data-grid');
      };
      initBody = function() {
        _this.$tbody = _this.$el.find('tbody');
        if (_this.$tbody.length) {
          return _this.$tbody.empty();
        } else {
          _this.$tbody = $('<tbody></tbody>');
          return _this.$el.append(_this.$tbody);
        }
      };
      initFoot = function() {
        _this.$tfoot = _this.$el.find('tfoot');
        if (_this.$tfoot.length) {
          return _this.$tfoot.empty();
        } else {
          _this.$tfoot = $('<tfoot></tfoot>');
          return _this.$el.append(_this.$tfoot);
        }
      };
      initHead = function() {
        _this.$thead = _this.$el.find('thead');
        if (_this.$thead.length) {
          return _this.$thead.empty();
        } else {
          _this.$thead = $('<thead></thead>');
          return _this.$el.append(_this.$thead);
        }
      };
      initTable();
      initHead();
      initBody();
      return initFoot();
    };

    SimpleDataGrid.prototype._removeDomElements = function() {
      this.$el.removeClass('simple-data-grid');
      if (this.$tbody) {
        this.$tbody.remove();
      }
      return this.$tbody = null;
    };

    SimpleDataGrid.prototype._bindEvents = function() {
      this.$el.delegate('tbody tr', 'click', $.proxy(this._clickRow, this));
      this.$el.delegate('thead tr.sorted', 'click', $.proxy(this._clickHeader, this));
      return this.$el.delegate('.pagination a', 'click', $.proxy(this._handleClickPage, this));
    };

    SimpleDataGrid.prototype._removeEvents = function() {
      this.$el.undelegate('tbody tr', 'click');
      this.$el.undelegate('tbody thead th a', 'click');
      return this.$el.undelegate('.pagination a', 'click');
    };

    SimpleDataGrid.prototype._loadData = function() {
      var getDataFromArray, getDataFromUrl, order_by, query_parameters,
        _this = this;
      query_parameters = $.extend({}, this.parameters, {
        page: this.current_page
      });
      order_by = this._getOrderByColumn();
      if (order_by) {
        query_parameters.order_by = order_by;
        if (this.sort_order === SortOrder.DESCENDING) {
          query_parameters.sortorder = 'desc';
        } else {
          query_parameters.sortorder = 'asc';
        }
      }
      getDataFromUrl = function() {
        _this.$el.addClass('loading');
        return $.ajax({
          url: _this._url,
          data: query_parameters,
          success: function(response) {
            var result;
            _this.$el.removeClass('loading');
            if ($.isArray(response) || typeof response === 'object' || (response == null)) {
              result = response;
            } else {
              result = $.parseJSON(response);
            }
            return _this._fillGrid(result);
          },
          cache: false,
          type: 'GET',
          dataType: 'json'
        });
      };
      getDataFromArray = function() {
        return _this._fillGrid(_this.options.data);
      };
      if (this._url) {
        return getDataFromUrl();
      } else if (this.options.data) {
        return getDataFromArray();
      } else {
        return this._fillGrid([]);
      }
    };

    SimpleDataGrid.prototype._fillGrid = function(data) {
      var addRowFromArray, addRowFromObject, event, fillFooter, fillHeader, fillPaginator, fillRows, generateTr, rows, total_pages,
        _this = this;
      addRowFromObject = function(row) {
        var column, html, value, _i, _len, _ref;
        html = '';
        _ref = _this.columns;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          column = _ref[_i];
          if (column.key in row) {
            value = row[column.key];
            if (column.on_generate) {
              value = column.on_generate(value, row);
            }
          } else {
            if (column.on_generate) {
              value = column.on_generate('', row);
            } else {
              value = '';
            }
          }
          html += "<td class=\"column_" + column.key + "\">" + value + "</td>";
        }
        return html;
      };
      addRowFromArray = function(row) {
        var column, html, i, value, _i, _len, _ref;
        html = '';
        _ref = _this.columns;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          column = _ref[i];
          if (i < row.length) {
            value = row[i];
          } else {
            value = '';
          }
          if (column.on_generate) {
            value = column.on_generate(value, row);
          }
          html += "<td class=\"column_" + column.key + "\">" + value + "</td>";
        }
        return html;
      };
      generateTr = function(row) {
        var data_string;
        if (row.id) {
          data_string = " data-id=\"" + row.id + "\"";
        } else {
          data_string = "";
        }
        return "<tr" + data_string + ">";
      };
      fillRows = function(rows) {
        var $tr, html, row, _i, _len;
        _this.$tbody.empty();
        for (_i = 0, _len = rows.length; _i < _len; _i++) {
          row = rows[_i];
          html = generateTr(row);
          if ($.isArray(row)) {
            html += addRowFromArray(row);
          } else {
            html += addRowFromObject(row);
          }
          html += '</tr>';
          $tr = $(html);
          $tr.data('row', row);
          if (_this.options.on_generate_tr) {
            _this.options.on_generate_tr($tr, row);
          }
          _this.$tbody.append($tr);
        }
        return null;
      };
      fillFooter = function(total_pages, row_count) {
        var html;
        if (!total_pages || total_pages === 1) {
          if (row_count === 0) {
            html = "<tr><td colspan=\"" + _this.columns.length + "\">No rows</td></tr>";
          } else {
            html = '';
          }
        } else {
          html = "<tr><td class=\"pagination\" colspan=\"" + _this.columns.length + "\">";
          html += fillPaginator(_this.current_page, total_pages);
          html += "</td></tr>";
        }
        _this.$tfoot.html(html);
        if (_this.options.on_generate_footer) {
          return _this.options.on_generate_footer(_this.$tfoot, _this, data);
        }
      };
      fillPaginator = function(current_page, total_pages) {
        var html, page, pages, _i, _len;
        html = '<ul>';
        pages = _this._getPages(current_page, total_pages);
        if (current_page > 1) {
          html += "<li><a href=\"#\" data-page=\"" + (current_page - 1) + "\">&lsaquo;&lsaquo;&nbsp;previous</a></li>";
        } else {
          html += "<li class=\"disabled\"><a href=\"#\">&lsaquo;&lsaquo;&nbsp;previous</a></li>";
        }
        for (_i = 0, _len = pages.length; _i < _len; _i++) {
          page = pages[_i];
          if (!page) {
            html += '<li><span>...</span></li>';
          } else {
            if (page === current_page) {
              html += "<li class=\"active\"><a>" + page + "</a></li>";
            } else {
              html += "<li><a href=\"#\" data-page=\"" + page + "\">" + page + "</a></li>";
            }
          }
        }
        if (current_page < total_pages) {
          html += "<li><a href=\"#\" data-page=\"" + (current_page + 1) + "\">next&nbsp;&rsaquo;&rsaquo;</a></li>";
        } else {
          html += "<li class=\"disabled\"><a>next&nbsp;&rsaquo;&rsaquo;</a></li>";
        }
        html += '</ul>';
        return html;
      };
      fillHeader = function(row_count) {
        var class_html, column, html, is_sorted, order_by, sort_text, _i, _len, _ref;
        order_by = _this._getOrderByColumn();
        is_sorted = order_by && (row_count !== 0);
        if (is_sorted) {
          html = '<tr class="sorted">';
        } else {
          html = '<tr>';
        }
        _ref = _this.columns;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          column = _ref[_i];
          html += "<th data-key=\"" + column.key + "\" class=\"column_" + column.key + "\">";
          if (!is_sorted) {
            html += column.title;
          } else {
            html += "<a href=\"#\">" + column.title;
            if (column.key === order_by) {
              class_html = "sort ";
              if (_this.sort_order === SortOrder.DESCENDING) {
                class_html += "asc sprite-icons-down";
                sort_text = '&#x25b2;';
              } else {
                class_html += "desc sprite-icons-up";
                sort_text = '&#x25bc;';
              }
              html += "<span class=\"" + class_html + "\">" + sort_text + "</span>";
            }
            html += "</a>";
          }
          html += "</th>";
        }
        html += '</tr>';
        return _this.$thead.html(html);
      };
      if ($.isArray(data)) {
        rows = data;
        total_pages = 0;
      } else if (data && data.rows) {
        rows = data.rows;
        total_pages = data.total_pages || 0;
      } else {
        rows = [];
      }
      this.total_pages = total_pages;
      fillRows(rows);
      fillFooter(total_pages, rows.length);
      fillHeader(rows.length);
      event = $.Event('datagrid.load_data');
      return this.$el.trigger(event);
    };

    SimpleDataGrid.prototype._clickRow = function(e) {
      var $tr, event;
      if (this.$selected_row) {
        this.$selected_row.removeClass('selected');
      }
      $tr = $(e.target).closest('tr');
      $tr.addClass('selected');
      this.$selected_row = $tr;
      event = $.Event('datagrid.select');
      event.row = $tr.data('row');
      event.$row = $tr;
      return this.$el.trigger(event);
    };

    SimpleDataGrid.prototype._handleClickPage = function(e) {
      var page;
      page = $(e.target).data('page');
      if (page) {
        this._gotoPage(page);
        return false;
      } else {
        return true;
      }
    };

    SimpleDataGrid.prototype._gotoPage = function(page) {
      if (page <= this.total_pages) {
        this.current_page = page;
        return this._loadData();
      }
    };

    SimpleDataGrid.prototype._clickHeader = function(e) {
      var $th, key;
      $th = $(e.target).closest('th');
      if ($th.length) {
        key = $th.data('key');
        if (key === this._getOrderByColumn()) {
          if (this.sort_order === SortOrder.ASCENDING) {
            this.sort_order = SortOrder.DESCENDING;
          } else {
            this.sort_order = SortOrder.ASCENDING;
          }
        } else {
          this.sort_order = SortOrder.ASCENDING;
        }
        this.order_by = key;
        this.current_page = 1;
        this._loadData();
      }
      return false;
    };

    SimpleDataGrid.prototype._getPages = function(current_page, total_pages) {
      var current_end, current_range, current_start, first_end, first_gap, first_range, last_gap, last_range, last_start, page_window;
      page_window = this._getPageWindow();
      first_end = min(page_window, total_pages);
      last_start = max(1, (total_pages - page_window) + 1);
      current_start = max(1, current_page - page_window);
      current_end = min(total_pages, current_page + page_window);
      if (first_end >= current_start) {
        current_start = 1;
        first_range = [];
      } else {
        first_range = range(1, first_end + 1);
      }
      if (current_end >= last_start) {
        current_end = total_pages;
        last_range = [];
      } else {
        last_range = range(last_start, total_pages + 1);
      }
      current_range = range(current_start, current_end + 1);
      first_gap = current_start - first_end;
      if (first_gap === 2) {
        first_range.push(first_end + 1);
      } else if (first_gap > 2) {
        first_range.push(0);
      }
      last_gap = last_start - current_end;
      if (last_gap === 2) {
        current_range.push(current_end + 1);
      } else if (last_gap > 2) {
        current_range.push(0);
      }
      return first_range.concat(current_range, last_range);
    };

    SimpleDataGrid.prototype.testGetPages = function(current_page, total_pages) {
      return this._getPages(current_page, total_pages);
    };

    SimpleDataGrid.prototype._getPageWindow = function() {
      if (this.options.paginator && this.options.paginator.page_window) {
        return this.options.paginator.page_window;
      } else {
        return 4;
      }
    };

    SimpleDataGrid.prototype._getOrderByColumn = function() {
      if (!this.order_by) {
        return null;
      } else if (this.order_by !== true) {
        return this.order_by;
      } else if (this.columns.length) {
        return this.columns[0].key;
      } else {
        return null;
      }
    };

    return SimpleDataGrid;

  })(SimpleWidget);

  SimpleWidget.register(SimpleDataGrid, 'simple_datagrid');

  slugify = function(string) {
    return string.replace(/[-\s]+/g, '_').replace(/[^a-zA-Z0-9\_]/g, '').toLowerCase();
  };

  parseQueryParameters = function(query_string) {
    var key, keyval, p, parameter_strings, query_parameters, value, _i, _len;
    query_parameters = {};
    parameter_strings = query_string.toString().split(/[&;]/);
    for (_i = 0, _len = parameter_strings.length; _i < _len; _i++) {
      p = parameter_strings[_i];
      if (p !== "") {
        keyval = p.split('=');
        key = keyval[0];
        value = keyval[1].replace('+', ' ');
        query_parameters[key] = value;
      }
    }
    return query_parameters;
  };

  parseUrl = function(url) {
    var base_url, query_parameters, query_string, url_parts;
    url_parts = url.split('?');
    if (url_parts.length === 1) {
      return [url, {}];
    } else {
      base_url = url_parts[0], query_string = url_parts[1];
      query_parameters = parseQueryParameters(query_string);
      return [base_url, query_parameters];
    }
  };

  this.SimpleDataGrid = SimpleDataGrid;

  SimpleDataGrid.slugify = slugify;

  SortOrder = {
    ASCENDING: 1,
    DESCENDING: 2
  };

}).call(this);
