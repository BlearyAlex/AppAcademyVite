/* eslint-disable react/prop-types */

const Breadcrumbs = ({ items }) => {
    return (
        <div className="flex items-center py-4 overflow-x-auto whitespace-nowrap">
            <nav aria-label="Breadcrumb">
                <ol className="list-reset flex">
                    <li className="flex items-center">
                        <a href="/" className="text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                        </a>
                        <span className="mx-5 text-gray-600">/</span>
                    </li>
                    {items.map((item, index) => (
                        <li key={index} className="flex items-center">
                            <a href={item.link} className={`hover:underline ${index === items.length - 1 ? 'text-fuchsia-400 font-semibold' : 'text-gray-600'}`}>
                                {item.label}
                            </a>
                            {index < items.length - 1 && <span className="mx-5 text-gray-600">/</span>}
                        </li>
                    ))}
                </ol>
            </nav>
        </div>
    );
};

export default Breadcrumbs;
