import AddProduct from './AddProduct'
import ProductList from './ProductList'
import ProductDetail from './ProductDetail'
import { useQuery } from '@apollo/react-hooks'
import { CATEGORIES_PRODUCTS } from './query'
import { useState } from 'react';
function Loading() {
    return <p>加载中...</p>
}
export default function App() {
    const { loading, data, error } = useQuery(CATEGORIES_PRODUCTS)
    const [product, setProduct] = useState({})
    if (!data) return <Loading />
    const { getCategories, getProducts } = data
    if (error) {
        return <p>加载发生错误</p>
    }
    if (loading) {
        return <Loading />
    }
    // getProducts[0].active = true
    return <>
        <div className='container'>
            <div className='row'>
                <div className='col-md-6'>
                    <div className='panel panel-default'>
                        <div className='panel-heading'>
                            <AddProduct categories={getCategories} />
                        </div>
                        <div className='panel-body'>
                            <ProductList products={getProducts} setProduct={setProduct} />
                        </div>
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='panel panel-default'>

                        <div className='panel-body'>
                            <ProductDetail product={product} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}