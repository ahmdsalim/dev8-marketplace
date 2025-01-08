/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UcFirst from "@/utils/UcFirst";
import UcWords from "@/utils/UcWords";
import { formatDate } from "@/utils/FormatDate";
import { formatRupiah } from "@/utils/FormatRupiah";
import UpdateResiNumberDialog from "./UpdateResiNumberDialog";

const DetailOrderDialog = ({ order, ...props }) => {
  const [openUpdateResi, setOpenUpdateResi] = useState(false);

  const handleClose = () => {
    props.onOpenChange?.(false);
  };

  const handleOnUpdateResi = (resiNumber) => {
    order.resi_number = resiNumber;
  };

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-2xl sm:overflow-y-hidden overflow-y-scroll max-h-screen">
        <DialogHeader>
          <DialogTitle>Detail Order</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 justify-center bg-slate-100">
          <div className="w-full grid gap-2">
            <div className="grid gap-3 bg-white pe-3 pb-3">
              <div
                className="py-3"
                style={{ borderBottom: "thin dashed #F0F3F7" }}
              >
                <div className="font-medium text-sm">
                  {UcFirst(order.status)}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-slate-500">Invoice Number</div>
                <div className="text-sm">{order.invoice_number}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-slate-500">Order Date</div>
                <div className="text-sm">{formatDate(order.order_date)}</div>
              </div>
            </div>
            <div className="grid gap-3 bg-white pe-3 pb-3">
              <div className="py-3">
                <div className="font-medium text-sm">Customer Info</div>
              </div>
              <div className="grid grid-cols-[100px_20px_1fr]">
                <div className="text-sm text-slate-500">Name</div>
                <div className="text-sm">:</div>
                <div className="text-sm">{order.user.name}</div>
              </div>
              <div className="grid grid-cols-[100px_20px_1fr]">
                <div className="text-sm text-slate-500">Email</div>
                <div className="text-sm">:</div>
                <div className="text-sm">{order.user.email}</div>
              </div>
            </div>
            <div className="grid gap-3 bg-white pe-3 pb-3">
              <div className="py-3">
                <div className="font-medium text-sm">Detail Product</div>
              </div>
              {order.order_items?.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <div className="text-sm">
                    {item.product.name} - {item.variant.name}
                  </div>
                  <div className="text-sm text-slate-500">
                    {item.quantity} x {formatRupiah(item.price)}
                  </div>
                </div>
              ))}
            </div>
            <div className="grid gap-3 bg-white pe-3 pb-3">
              <div className="py-3">
                <div className="font-medium text-sm">Delivery Info</div>
              </div>
              <div className="grid grid-cols-[100px_20px_1fr]">
                <div className="text-sm text-slate-500">Courier</div>
                <div className="text-sm">:</div>
                <div className="text-sm">{order.user.name}</div>
              </div>
              <div className="grid grid-cols-[100px_20px_1fr]">
                <div className="text-sm text-slate-500">Resi Number</div>
                <div className="text-sm">:</div>
                <div className="text-sm">
                  {order.resi_number ? order.resi_number : (order.status === "processed" ? (
                    <button
                      className="text-xs text-white bg-green-600/70 px-2 py-1 rounded outline-none focus:outline-none relative"
                      onClick={() => setOpenUpdateResi(true)}
                    >
                      Update Resi
                    </button>
                  ) : (
                    "-"
                  ))}
                </div>
                {openUpdateResi && (
                  <UpdateResiNumberDialog
                    open={openUpdateResi}
                    onOpenChange={() => setOpenUpdateResi(false)}
                    onResiAdded={handleOnUpdateResi}
                    orderId={order.id}
                  />
                )}
              </div>
              <div className="grid grid-cols-[100px_20px_1fr]">
                <div className="text-sm text-slate-500">Address</div>
                <div className="text-sm">:</div>
                <div className="text-sm">
                  <div className="font-semibold">{order.user.name}</div>
                  <div>{order.user.phone}</div>
                  <div>{order.delivery_address}</div>
                </div>
              </div>
            </div>
            <div className="grid gap-3 bg-white pe-3 pb-3">
              <div className="py-3">
                <div className="font-medium text-sm">Detail Payment</div>
              </div>
              <div
                className="flex justify-between pb-3"
                style={{ borderBottom: "thin dashed #F0F3F7" }}
              >
                <div className="text-sm text-slate-500">Payment Method</div>
                <div className="text-sm">
                  {UcWords(order.payment?.payment_method)}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-slate-500">
                  Item Price Subtotal
                </div>
                <div className="text-sm">{formatRupiah(order.subtotal)}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-slate-500">
                  Total Delivery Cost
                </div>
                <div className="text-sm">
                  {formatRupiah(order.delivery_cost)}
                </div>
              </div>
              <div
                className="flex justify-between pt-3"
                style={{ borderTop: "thin dashed #F0F3F7" }}
              >
                <div className="text-sm font-medium">Total Shopping</div>
                <div className="text-sm">
                  {formatRupiah(order.total_amount)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailOrderDialog;
