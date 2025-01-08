/* eslint-disable react/prop-types */
import { formatRupiah } from "@/utils/FormatRupiah";
import {
  Avatar,
  AvatarFallback
} from "@/components/ui/avatar"
import getInitials from "@/utils/GetInitials";
import UcFirst from "@/utils/UcFirst";

export function RecentOrders({ orders }) {
    return (
      <div className="space-y-8">
        {orders.map((order, index) => (
          <div key={index} className="flex items-center">
            <Avatar className="h-9 w-9">
                <AvatarFallback>{ getInitials(order.user.name) }</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{ order.user.name }</p>
              <p className="text-sm text-muted-foreground">
                {order.user.email}
              </p>
            </div>
            <div className="ml-auto flex flex-col gap-1 items-end">
              {/* status and total */}
              <p className="text-sm font-normal rounded-full px-2 border">{ UcFirst(order.status) }</p>
              <p className="text-sm">{formatRupiah(order.total_amount)}</p>
            </div>
          </div>
        ))}
      </div>
    )
  }