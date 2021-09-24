import React, {useState, useEffect} from "react";
import { useTable, useFilters, useColumnOrder, useSortBy} from "react-table";
import axios from 'axios';

export default function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setFilter,
    setColumnOrder
  } = useTable({
    columns,
    data
  },
  useFilters,
  useColumnOrder,
  useSortBy
  );

  const [filterInput, setFilterInput] = useState('');
  const [searchInput, setSearchInput ] = useState('');

  const handleFilterChange = e => {
    const value = e.target.value || undefined;
    setFilter("show.name", value);
    setFilterInput(value);
  }


  const handleSearchChange = e => {
    const value = e.target.value || undefined;
    setFilter("show.name", value);
    setFilterInput(value);
  }
  
  const changeOrder = () => {
    setColumnOrder(['show.type','show.name', 'show.language', 'show.genres', 'show.runtime', 'show.status'])
  }

  useEffect(() => {
    (async () => {
      const result = await axios(`https://api.tvmaze.com/search/shows?q=${filterInput}`);
      data = result.data;
    })();
  }, [searchInput]);


  return (
    <>
    <button onClick={changeOrder}>Change column order</button>
    <input
      value={filterInput}
      onChange={handleFilterChange}
      placeholder='Search name'
    />

    <input
      value={searchInput}
      onChange={handleSearchChange}
      placeholder='Search all'
    />

    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th 
                {...column.getHeaderProps(column.getSortByToggleProps())}
                className={
                  column.isSorted
                  ? column.isSortedDesc
                  ? "sort-desc"
                  : "sort-asc"
                  : ""
                }
              >
                {column.render(`Header`)}</th>
            ))}
          </tr>
        ))}
          </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, index) =>{
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            );
          })}

        </tbody>
    </table>
          </>
  )
}