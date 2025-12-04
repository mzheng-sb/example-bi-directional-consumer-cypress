import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'spectre.css/dist/spectre.min.css';
import 'spectre.css/dist/spectre-icons.min.css';
import 'spectre.css/dist/spectre-exp.min.css';
import Layout from './Layout';
import Heading from './Heading';
import API from './api';
import { Product } from './product';

function ProductPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [product, setProduct] = useState<Product | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        const response = await API.getProduct(id);
        setProduct(response);
      } catch (error) {
        console.error('Failed to load product:', error);
        navigate('/error', { state: { error: error instanceof Error ? error.toString() : String(error) } });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const productInfo = (
    <div>
      <p className="product-id">ID: {product?.id}</p>
      <p className="product-name">Name: {product?.name}</p>
      <p className="product-type">Type: {product?.type}</p>
    </div>
  );

  return (
    <Layout>
      <Heading text="Products" href="/" />
      {loading ? (
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          className="loading loading-lg"
        />
      ) : (
        productInfo
      )}
    </Layout>
  );
}

export default ProductPage;
