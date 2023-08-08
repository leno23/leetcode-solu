import { useState } from 'react';
import { ADD_PRODUCT, GET_PRODUCTS } from './query'
import { useMutation } from '@apollo/react-hooks';
export default function AddProduct({ categories }) {
    const [product, setProduct] = useState({})
    const [addProduct] = useMutation(ADD_PRODUCT)
    function handleSubmit(e) {
        e.preventDefault();
        addProduct({
            variables: product,
            refetchQueries: [{
                query: GET_PRODUCTS
            }]
        })
    }
    return <form onSubmit={handleSubmit}>
        <div className='form-group'>
            <label>产品名称</label>
            <input type="text" value={product.name} onChange={e => {
                setProduct({
                    ...product,
                    name: e.target.value
                })
            }} className='form-control' />
        </div>
        <div className='form-group'>
            <label>产品分类</label>
            <select className='form-control' onChange={(e) => {
                setProduct({
                    ...product,
                    categoryId: e.target.value
                })
            }}>
                <option value="">请选择分类</option>
                {categories.map(item => {
                    return <option key={item.name} value={item.id}>{item.name}</option>
                })}
            </select>
        </div>
        <div className='form-group'>
            <input type='submit' className='btn btn-primary' />
        </div>
    </form>
}