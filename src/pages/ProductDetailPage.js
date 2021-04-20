import axios from 'axios';
import { useState, useEffect } from 'react';
import { Paper } from '@material-ui/core';

export default function ProductDetailPage() {
  const [name, setName] = useState();
  const [price, setPrice] = useState();
  // const [productName, setProductName] = useState();

  useEffect(() => {
    axios.get(window.location.href.replace(':3000', ':4000'))
      .then((res) => {
        setName(res.name);
      })
      .catch((e) => console.error(e));
  }, []);

  return (
    <Paper>{name}, {price}</Paper>
  )
}