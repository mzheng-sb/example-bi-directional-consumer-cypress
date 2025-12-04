import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import 'spectre.css/dist/spectre.min.css';
import 'spectre.css/dist/spectre-icons.min.css';
import 'spectre.css/dist/spectre-exp.min.css';
import Heading from './Heading';
import Layout from './Layout';
import API from './api';
import { Product } from './product';

interface ProductTableRowProps {
  product: Product;
}

function ProductTableRow(props: ProductTableRowProps) {
  return (
    <tr className="product-item">
      <td>{props.product.name}</td>
      <td>{props.product.type}</td>
      <td>
        <Link
          className="btn btn-link"
          to={{
            pathname: '/products/' + props.product.id,
          }}
          state={{
            product: props.product
          }}
        >
          See more!
        </Link>
      </td>
    </tr>
  );
}

interface ProductTableProps {
  products: Product[];
}

function ProductTable(props: ProductTableProps) {
  const products = props.products.map((p) => <ProductTableRow key={p.id} product={p} />);
  return (
    <table className="table table-striped table-hover">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th />
        </tr>
      </thead>
      <tbody>{products}</tbody>
    </table>
  );
}

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const id = new URLSearchParams(location.search).get('id') || undefined;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.getAllProducts(id);
        setProducts(response);
        setVisibleProducts(response);
      } catch (error) {
        console.error('Failed to load products:', error);
        navigate('/error', { state: { error: error instanceof Error ? error.toString() : String(error) } });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id, navigate]);

  const determineVisibleProducts = () => {
    const findProducts = (search: string): Product[] => {
      search = search.toLowerCase();
      return products.filter(
        (p) =>
          p.id.toLowerCase().includes(search) ||
          p.name.toLowerCase().includes(search) ||
          p.type.toLowerCase().includes(search)
      );
    };

    setVisibleProducts(searchText ? findProducts(searchText) : products);
  };

  const onSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    determineVisibleProducts();
  };

  return (
    <Layout>
      <Heading text="Products" href="/" />
      <div className="form-group col-2">
        <label className="form-label" htmlFor="input-product-search">
          Search
        </label>
        <input
          id="input-product-search"
          className="form-input"
          type="text"
          value={searchText}
          onChange={onSearchTextChange}
        />
      </div>
      {loading ? (
        <div className="loading loading-lg centered" />
      ) : (
        <ProductTable products={visibleProducts} />
      )}
    </Layout>
  );
}

export default App;
