import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, ShoppingBag, MapPin, Clock } from 'lucide-react';
import { ProductFlavor, ToppingOption, FLAVOR_LIST } from '@/config/brand';
import { ApiStore, getStores } from '@/features/catalog/api/catalog';
import { placeCustomOrder } from '@/features/checkout/api/orders';

interface OrderModalProps {
  isOpen: boolean;
  initialFlavor?: ProductFlavor | null;
  initialToppings?: ToppingOption[];
  onClose: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  initialFlavor,
  initialToppings,
  onClose,
}) => {
  const selectedFlavor = initialFlavor || FLAVOR_LIST[0];
  const [stores, setStores] = useState<ApiStore[]>([]);
  const [selectedStore, setSelectedStore] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderCode, setOrderCode] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    getStores().then((availableStores) => {
      setStores(availableStores);
      setSelectedStore((current) => current || availableStores[0]?.id || '');
    }).catch(() => setError('Không tải được danh sách cửa hàng'));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const order = await placeCustomOrder(
        {
          baseFlavorId: selectedFlavor.id,
          extraFlavorIds: [],
          toppingIds: initialToppings?.map((topping) => topping.id) ?? [],
          sizeId: 'regular',
        },
        quantity,
        { storeId: selectedStore, customerName, customerPhone },
      );
      setOrderCode(order.orderCode);
      setIsSubmitted(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Không thể tạo đơn hàng');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStore = stores.find((s) => s.id === selectedStore);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-xl bg-brand-surface border border-brand-white/10 rounded-3xl p-6 md:p-8 shadow-2xl text-brand-foreground overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-brand-white/5 hover:bg-brand-white/10 text-brand-white/70 hover:text-brand-white transition-colors"
          aria-label="Close Order Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-brand-primary mb-2">
              <ShoppingBag className="w-4 h-4" />
              <span>PARLOR PICKUP ORDER</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-display font-semibold mb-6">
              Place Your Swirl Order
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  required
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Your name"
                  className="rounded-xl bg-brand-white/5 border border-brand-white/10 px-4 py-3 text-sm text-brand-foreground outline-none focus:border-brand-primary"
                />
                <input
                  required
                  value={customerPhone}
                  onChange={(event) => setCustomerPhone(event.target.value)}
                  placeholder="Phone number"
                  className="rounded-xl bg-brand-white/5 border border-brand-white/10 px-4 py-3 text-sm text-brand-foreground outline-none focus:border-brand-primary"
                />
              </div>

              {error && <p className="text-sm text-brand-accent" role="alert">{error}</p>}

              {/* Flavor Summary */}
              <div className="bg-brand-white/5 p-4 rounded-2xl border border-brand-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-brand-white/50 block">Selected Item</span>
                  <p className="text-sm font-semibold text-brand-foreground">{selectedFlavor.name}</p>
                  {initialToppings && initialToppings.length > 0 && (
                    <p className="text-xs text-brand-primary mt-0.5">
                      + {initialToppings.map((t) => t.name).join(', ')}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 bg-brand-white/5 rounded-full p-1 border border-brand-white/10">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-brand-white/70 hover:text-brand-white hover:bg-brand-white/10"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold px-2">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-brand-white/70 hover:text-brand-white hover:bg-brand-white/10"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Select Store Location */}
              <div>
                <label className="text-xs uppercase tracking-widest text-brand-white/60 font-semibold block mb-2">
                  Select Boutique Parlor
                </label>
                <div className="space-y-2">
                  {stores.map((store) => (
                    <label
                      key={store.id}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                        selectedStore === store.id
                          ? 'bg-brand-white/10 border-brand-primary'
                          : 'bg-brand-white/5 border-brand-white/5 hover:border-brand-white/15'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="store"
                          value={store.id}
                          checked={selectedStore === store.id}
                          onChange={() => setSelectedStore(store.id)}
                          className="accent-brand-primary"
                        />
                        <div>
                          <p className="text-xs font-semibold text-brand-foreground">{store.name}</p>
                          <p className="text-[11px] text-brand-white/50">{store.address}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-brand-pistachio font-medium">
                        {store.active ? 'Open Now' : 'Closed'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-brand-white/10 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-brand-white/60 hover:text-brand-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-primary hover:bg-brand-primaryHover text-brand-background font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full transition-all transform hover:scale-105 shadow-lg shadow-brand-primary/20"
                >
                  {isSubmitting ? 'Sending...' : 'Confirm Order'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation State */
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 bg-brand-pistachio/10 rounded-full flex items-center justify-center mx-auto text-brand-pistachio">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-pistachio block mb-1">
                ORDER CONFIRMED
              </span>
              <h3 className="text-3xl font-display font-semibold mb-2">Order #{orderCode}</h3>
              <p className="text-xs text-brand-white/60 font-light max-w-sm mx-auto">
                Your order for {quantity}x {selectedFlavor.name} has been received by {currentStore?.name}.
              </p>
            </div>

            <div className="bg-brand-white/5 p-4 rounded-2xl border border-brand-white/5 text-left text-xs space-y-2">
              <div className="flex items-center space-x-2 text-brand-white/80">
                <MapPin className="w-4 h-4 text-brand-primary" />
                <span>{currentStore?.name} — {currentStore?.address}</span>
              </div>
              <div className="flex items-center space-x-2 text-brand-white/80">
                <Clock className="w-4 h-4 text-brand-primary" />
                <span>Estimated Pickup Time: Ready in ~15 minutes</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-brand-primary text-brand-black font-bold text-xs uppercase tracking-widest py-3.5 rounded-full shadow-lg"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
