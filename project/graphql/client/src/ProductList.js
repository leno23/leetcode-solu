import { useState } from 'react'

export default function ProductList(props) {
    const { products, setProduct } = props
    const [ localProducts, setProducts ] = useState(products || [])
    return <>
        <table className='table table-striped'>
            <caption className='text-center'>产品列表</caption>
            <thead>
                <tr>
                    <td>名称</td>
                    <td>分类</td>
                </tr>
            </thead>
            <tbody>
                {
                    localProducts.map(item => {
                        const { name, category, id } = item
                        return <tr key={id} style={{ color: `${item.active ? 'blue' : '#333'}` }} onClick={() => {
                            setProduct(item)
                            for (let item of localProducts) {
                                item.active = false
                                if (item.id === id) {
                                    item.active = true
                                }
                            }
                            setProducts(JSON.parse(JSON.stringify(localProducts)))
                        }}>
                            <td>{name}</td>
                            <td>{category.name}</td>
                        </tr>
                    })
                }
            </tbody>
        </table>
    </>
}