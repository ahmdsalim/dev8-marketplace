<table>
    <thead>
        <tr>
            <th>Invoice Number</th>
            <th>Product Name</th>
            <th>Product Variant</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($orderItems as $item)
            <tr>
                <td>{{ $item->order->invoice_number }}</td>
                <td>{{ $item->product->name }}</td>
                <td>{{ $item->variant->name }}</td>
                <td>{{ $item->price }}</td>
                <td>{{ $item->quantity }}</td>
                <td>{{ $item->price * $item->quantity }}</td>
            </tr>
        @endforeach
    </tbody>
</table>