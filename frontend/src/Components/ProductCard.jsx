import {useState} from 'react';
import {useAuth} from '../Context/AuthProvider';
import {formatINR} from '../utils/formatters';
import {useNavigate} from "react-router-dom";

const ProductCard = ({products, quantities, setQuantities, isResult}) => {
    const {user} = useAuth();

    const [isDisable, setIsDisable] = useState(false);
    const [overlay, setOverlay] = useState(false);

    const navigate = useNavigate();

    const updateQuantity = (productId, value, stock) => {
        const qty = Math.max(1, Math.min(stock, Number(value)));

        setQuantities((prev) => ({
            ...prev,
            [productId]: qty,
        }));
    };

    const handleOrder = async (product, quantity) => {
        if (user === null) {
            setIsDisable(true);
            setOverlay(true);
            console.log('User not logged in');
            return;
        }

        setIsDisable(true);

        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    items: [
                        {
                            productId: product.id,
                            quantity: quantity,
                        },
                    ],
                }),
                credentials: 'include',
            });

            if (!res.ok) {
                console.log('Something went wrong while sending order', res.status, res.statusText);
                return;
            }

            console.log(await res.text());
        } catch (error) {
            console.log('Something went wrong', error);
        } finally {
            setIsDisable(false);
        }
    };

    const isResultCheck = (product) => {
        if (isResult) return true;

        return product?.stock > 0;
    };

    return products?.length === 0 ? (
        <i>No products yet!</i>
    ) : (
        products.map(
            (product) =>
                isResultCheck(product) && ( // Ensure 0 stock product won't show on home page, this may change to make them have a visual indicator that this item is out of stock, but still appear.
                    <>
                      {/* Overlay on screen to redirect users to login screen */}
                      {overlay && <div className={"backdrop-blur-md bg-black/40 flex item-center justify-center fixed inset-0 z-10"}>
                        <div className={"my-auto bg-slate-700 rounded-2xl h-52 w-96 p-8 flex flex-col justify-center gap-10"}>
                          <p className={"text-slate-200 text-lg"}>Login to continue!</p>
                          <div className={"flex justify-center gap-2"}>
                            <button className={"bg-amber-500 h-12 w-full rounded cursor-pointer hover:bg-amber-400 active:bg-amber-600"}
                                    onClick={() => {navigate("/login")}}
                            >
                              Login
                            </button><button className={"bg-rose-500 h-12 w-full rounded cursor-pointer hover:bg-rose-400 active:bg-rose-600"}
                                    onClick={() => {
                                      setIsDisable(false);
                                      setOverlay(false);
                                    }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>}
                        <div
                            key={product.id}
                            className="min-h-52 w-64 bg-slate-700 flex flex-col justify-end text-white rounded-xl shadow-lg p-4"
                        >
                            <h2 className="text-lg font-bold mb-2">{product.name}</h2>
                            <p className="text-sm text-gray-300">{product.description}</p>
                            <p className="font-light">{formatINR(product.price)}</p>
                            <p className="text-xs text-gray-400">Category: {product.categoryName}</p>
                            <p
                                className={`text-xs font-extralight' ${product.stock < 25 ? 'text-red-400' : 'text-green-400'}`}
                            >
                                {product.stock}
                            </p>
                            <div className="flex items-center gap-2 mb-2">
                                <button
                                    onClick={() =>
                                        updateQuantity(product.id, quantities[product.id] - 1, product.stock)
                                    }
                                    className="bg-slate-600 px-3 rounded hover:bg-slate-500"
                                >
                                    -
                                </button>

                                <input
                                    type="number"
                                    value={quantities[product.id] || 1}
                                    min={1}
                                    max={product.stock}
                                    onChange={(e) => updateQuantity(product.id, e.target.value, product.stock)}
                                    className="w-16 text-center bg-slate-800 rounded outline-none no-spinner"
                                />

                                <button
                                    onClick={() =>
                                        updateQuantity(product.id, quantities[product.id] + 1, product.stock)
                                    }
                                    className="bg-slate-600 px-3 rounded hover:bg-slate-500"
                                >
                                    +
                                </button>
                            </div>
                            <button
                                disabled={isDisable}
                                onClick={() => {
                                    handleOrder(product, quantities[product.id]);
                                }}
                                className="bg-sky-700 rounded cursor-pointer active:bg-sky-800 disabled:grayscale transition hover:-translate-0.5 disabled:translate-0"
                            >
                                {isDisable ? 'Processing....' : 'Add to cart'}
                            </button>
                        </div>
                    </>
                )
        )
    );
};

export default ProductCard;
