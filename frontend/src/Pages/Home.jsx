import { useState, useEffect } from 'react';
import { LuSearch } from 'react-icons/lu';
import ProductCard from '../Components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [pageInfo, setPageInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/product?page=${page}&size=10`);
        if (res.ok) {
          const data = await res.json();

          const initialQty = {};
          data.content.forEach((product) => {
            initialQty[product.id] = 1;
          });

          setQuantities(initialQty);

          setProducts(data.content);
          setPageInfo({
            page: data.page,
            size: data.size,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
          });
        }
      } catch (error) {
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const pageForward = (e) => {
    if (pageInfo.totalPages > page) setPage(page + 1);
  };
  const pageBackward = (e) => {
    if (page !== 0) setPage(page - 1);
  };

  const handleSearch = async () => {
    if (!search.trim()) return;

    try {
      const res = await fetch(`/api/product/search?keyword=${search}`);
      if (!res.ok) {
        console.log('Something went wrong: ', res.statusText);
        return;
      }
      const data = await res.json();

      setResults(data);
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  return (
    <div className={`md:mx-12 min-h-[calc(100dvh-86px)] border-x bg-[#1c1e29] border-slate-700`}>
      {/* Pagination */}
      {!pageInfo || Object.keys(pageInfo).length === 0 ? (
        <i>No items</i>
      ) : (
        <div className="h-fit w-full bg-black border-b border-b-slate-700 p-1 pl-2 flex justify-between">
          <p>
            {pageInfo.page + 1}-{pageInfo.totalPages} of {pageInfo.totalElements} results, and size
            of {pageInfo.size}
          </p>
          <div>
            <button
              onClick={pageBackward}
              className={`h-fit w-fit px-4 tracking-wider text-blue-500 cursor-pointer hover:underline ${page === 0 ? 'hidden' : ''}`}
            >
              Previous
            </button>
            <button
              onClick={pageForward}
              className={`h-fit w-fit px-4 tracking-wider text-blue-500 cursor-pointer hover:underline ${pageInfo.totalPages === page + 1 ? 'hidden' : ''}`}
            >
              Next
            </button>
          </div>
        </div>
      )}
      {/* Search */}
      <div className="w-full h-10 text-center flex justify-center align-middle mt-1">
        <div className="flex shadow-2xl shadow-gray-500 text-lg">
          <input
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            type="search"
            name="search"
            placeholder="Search"
            className="flex-1 outline-none border border-slate-500 text-slate-200 py-0.5 px-2 caret-sky-300 focus:border-sky-500"
          />
          <button
            onClick={() => {
              handleSearch();
            }}
            className="px-2 cursor-pointer border-y border-r border-slate-500 transition hover:bg-blue-950 active:bg-sky-800"
          >
            <LuSearch />
          </button>
        </div>
      </div>
      {/* Products (HomePage and Search) */}
      <div className="w-full flex flex-wrap justify-center gap-6 p-2">
        {loading ? (
          <div className="loader"></div>
        ) : error ? (
          <p>{error}</p>
        ) : results.length !== 0 ? (
          <ProductCard
            products={results}
            quantities={quantities}
            setQuantities={setQuantities}
            isResult={true}
          />
        ) : (
          <ProductCard
            products={products}
            quantities={quantities}
            setQuantities={setQuantities}
            isResult={false}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
