/* eslint-disable react/prop-types */

const Breadcrumbs = ({ items }) => {
    return (
        <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="list-reset flex">
                {items.map((item, index) => (
                    <li key={index} className="mr-2">
                        <a href={item.link} className="text-indigo-600 hover:text-indigo-800">
                            {item.label}
                        </a>
                        {index < items.length - 1 && <span className="mx-2">/</span>}
                    </li>
                ))}
            </ol>
        </nav>
    )
}

export default Breadcrumbs