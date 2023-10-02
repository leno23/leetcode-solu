export default function ProductList(props) {
    const { product } = props
    return <ul className='list-group'>
        <li className='list-group-item'>ID:{product.id}</li>
        <li className='list-group-item'>产品名称:{product.name}</li>
        <li className='list-group-item'>分类名称:{product.category?.name}</li>
        <li className='list-group-item'>
            <ul className='list-group'>
                此分类下的所有产品
                {
                    product.category?.products.map(item => {
                        return <li className='list-group-item' key={item.id}>{item.name}</li>
                    })
                }
            </ul>

        </li>
    </ul>
}