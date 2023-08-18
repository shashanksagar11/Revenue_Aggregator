import './App.css';
import React from 'react';
import { useState, useEffect } from "react";

const fetchfile = ['JSON/branch1.json', "JSON/branch2.json", "JSON/branch3.json"]

function App() {
  const [searchdata, setSearchdata] = useState('');
  const [searcheData, setSearcheData] = useState([]);
  const [products, setProducts] = useState([]);
  const filteredProducts = [];

  useEffect(() => {
    const fetchdata = fetchfile.map((url) => fetch(url).then(response => response.json()))
    Promise.all(fetchdata).then(response => {
      setProducts(response.map((obj) => obj.products).flat())
    }).catch(error => { console.error(error) })
  }, []
  )


  products.map((item) => {
    const sameProduct = products.filter(obj => item.id === obj.id)
    let allSold = 0;
    let temp = {};
    sameProduct.forEach(product => {
      allSold += product.sold;
      temp.id = product.id;
      temp.name = product.name;
      temp.allSold = allSold;
      temp.unitPrice = product.unitPrice;
    })
    if (!filteredProducts.some(val => val.id === temp.id)) {
      filteredProducts.push(temp);
    }
    return temp;
  })

  filteredProducts.forEach(item => {
    item.revenue = item.allSold * item.unitPrice
  })

  const sortedProducts = filteredProducts?.slice().sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

  const getTotalRevenue = (arr) => {
    let totalRevenue = 0
    arr.forEach(item => totalRevenue += item.revenue);
    return totalRevenue;
  }

  function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const search = (e) => {
    setSearchdata(e.target.value)
    setSearcheData(sortedProducts.filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase())));
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "green", padding: "15px" }}>
        
        <div  style={{width:"30%", fontSize:"25px", marginLeft:"25px",color:'white', fontWeight:"bold"}}>
          Wishdomleaf
        </div>

        <div style={{width:"70%", color:'aliceblue'}}>
        <label for="filterInput"
          style={{ padding: "10px" }}
        >Search by product name :</label>
        <input type="text" id="filterInput"
          style={{ height: "25px", border: "none", padding: "10px" }}
          placeholder="Search..." onChange={search} />
        </div>
       
      </div>

      <table border={1} style={{ width: '25vw', margin: '50px auto' }}>
        <tr>
          <th>
            Name
          </th>
          <th>
            Total_Revenue
          </th>
        </tr>

        {!searchdata && sortedProducts?.map((item, i) => {
          return (
            <tr key={i}>
              <td style={{ padding: '10px', textAlign: 'center' }}>{item.name}</td>
              <td style={{ padding: '10px', textAlign: 'right' }}>{formatNumber(item.revenue.toFixed(2))}</td>
            </tr>
          )
        })}
        {searchdata && searcheData?.map((item, i) => {
          return (
            <tr key={i}>
              <td style={{ padding: '10px', textAlign: 'center' }}>{item.name}</td>
              <td style={{ padding: '10px', textAlign: 'right' }}>{formatNumber(item.revenue.toFixed(2))}</td>
            </tr>
          )
        })}

        <tr>
          <th style={{ padding: '10px' }}>Total_Revenue</th>
          <th style={{ padding: '10px', textAlign: 'right' }}>{formatNumber(Math.round(searchdata ? getTotalRevenue(searcheData) : getTotalRevenue(sortedProducts)))}</th>
        </tr>

      </table>
    </div>
  )
}
export default App;