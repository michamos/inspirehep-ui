import React, { Component } from 'react';
import { Table, Icon } from 'antd';
import PropTypes from 'prop-types';
import FilterDropdown from './FilterDropdown';
import './ExceptionsTable.scss';

class ExceptionsTable extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    const { exceptions } = nextProps;
    const collectionColumnFilters = ExceptionsTable.getCollectionColumnFilters(
      exceptions
    );
    return {
      ...prevState,
      allExceptions: exceptions,
      filteredExceptions: exceptions,
      collectionColumnFilters,
    };
  }

  static getCollectionColumnFilters(exceptions) {
    const collectionsMap = exceptions.reduce((acc, exception) => {
      acc[exception.collection] = true;
      return acc;
    }, {});
    return Object.keys(collectionsMap).map(collection => ({
      text: collection,
      value: collection,
    }));
  }

  static hasCollection(exception, collection) {
    return exception.collection === collection;
  }

  constructor(props) {
    super(props);
    this.state = {
      isErrorFilterDropdownVisible: false,
      isErrorFilterFocused: false,
      isRecidFilterDropdownVisible: false,
      isRecidFilterFocused: false,
    };

    this.onRecidFilterDropdownVisibleChange = this.onRecidFilterDropdownVisibleChange.bind(
      this
    );
    this.onErrorFilterDropdownVisibleChange = this.onErrorFilterDropdownVisibleChange.bind(
      this
    );
    this.onErrorSearch = this.onErrorSearch.bind(this);
    this.onRecidSearch = this.onRecidSearch.bind(this);
  }

  onErrorFilterDropdownVisibleChange(visible) {
    this.setState({
      isErrorFilterDropdownVisible: visible,
      isErrorFilterFocused: visible,
    });
  }

  onRecidFilterDropdownVisibleChange(visible) {
    this.setState({
      isRecidFilterDropdownVisible: visible,
      isRecidFilterFocused: visible,
    });
  }

  onErrorSearch(searchText) {
    const searchRegExp = new RegExp(searchText, 'gi');
    const { allExceptions } = this.state;
    const filteredExceptions = allExceptions.filter(exception =>
      exception.error.match(searchRegExp)
    );
    this.setState({
      isErrorFilterDropdownVisible: false,
      filteredExceptions,
    });
  }

  onRecidSearch(recidText) {
    const recid = Number(recidText);
    const { allExceptions } = this.state;
    // TODO: create a lookup map in order to avoid `findIndex`
    const exceptionIndex = allExceptions.findIndex(
      exception => exception.recid === recid
    );
    const filteredExceptions =
      exceptionIndex >= 0 ? [allExceptions[exceptionIndex]] : [];
    this.setState({
      isRecidFilterDropdownVisible: false,
      filteredExceptions,
    });
  }

  render() {
    const { collectionColumnFilters } = this.state;

    const columns = [
      {
        title: 'Collection',
        dataIndex: 'collection',
        filters: collectionColumnFilters,
        onFilter: ExceptionsTable.hasCollection,
      },
      {
        title: 'Error',
        dataIndex: 'error',
        filterDropdown: (
          <FilterDropdown
            placeholder="Search error"
            onSearch={this.onErrorSearch}
            focused={this.state.isErrorFilterFocused}
          />
        ),
        filterIcon: <Icon type="search" />,
        filterDropdownVisible: this.state.isErrorFilterDropdownVisible,
        onFilterDropdownVisibleChange: this.onErrorFilterDropdownVisibleChange,
        width: '70%',
        render: text => text.split('\n', 1)[0],
      },
      {
        title: 'Record',
        dataIndex: 'recid',
        filterDropdown: (
          <FilterDropdown
            placeholder="Go to recid"
            onSearch={this.onRecidSearch}
            focused={this.state.isRecidFilterFocused}
          />
        ),
        filterIcon: <Icon type="search" />,
        filterDropdownVisible: this.state.isRecidFilterDropdownVisible,
        onFilterDropdownVisibleChange: this.onRecidFilterDropdownVisibleChange,
        render: text => {
          const recordLink = `http://inspirehep.net/record/${text}/edit`;
          return <a href={recordLink}>{text}</a>;
        },
      },
    ];

    return (
      <Table
        className="__ExceptionsTable__"
        columns={columns}
        dataSource={this.state.filteredExceptions}
        rowKey="recid"
        pagination={{ pageSize: 25 }}
        onChange={this.onSelectedCollectionsChange}
        expandedRowRender={record => <pre>{record.error}</pre>}
        bordered
      />
    );
  }
}

ExceptionsTable.propTypes = {
  /* eslint-disable react/no-unused-prop-types */
  exceptions: PropTypes.arrayOf(
    PropTypes.shape({
      collection: PropTypes.string,
      error: PropTypes.string,
      recid: PropTypes.number,
    })
  ).isRequired,
  /* eslint-disable react/no-unused-prop-types */
};

export default ExceptionsTable;