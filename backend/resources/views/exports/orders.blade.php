<table>
    <thead>
        <tr>
            <th>Invoice Number</th>
            <th>Order Date</th>
            <th>Customer Name</th>
            <th>Customer Email</th>
            <th>Courier</th>
            <th>Courier Service</th>
            <th>Delivery Cost</th>
            <th>Status Order</th>
            <th>Payment Method</th>
            <th>Total Amount</th>
            <th>Delivery Address</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($orders as $order)
            <tr>
                <td>{{ $order->invoice_number }}</td>
                <td>{{ $order->order_date->format('Y-m-d') }}</td>
                <td>{{ $order->user->name }}</td>
                <td>{{ $order->user->email }}</td>
                <td>{{ $order->courier }}</td>
                <td>{{ $order->courier_service }}</td>
                <td>{{ $order->delivery_cost }}</td>
                <td>{{ $order->status }}</td>
                <td>{{ $order->payment->payment_method ?? '' }}</td>
                <td>{{ $order->total_amount }}</td>
                <td>{{ $order->delivery_address }}</td>
            </tr>
        @endforeach
    </tbody>
</table>