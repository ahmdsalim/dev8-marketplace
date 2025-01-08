<table>
    <thead>
    <tr>
        <th>No</th>
        <th>Product Name</th>
        <th>Description</th>
        <th>Category</th>
        <th>Price</th>
        <th>Weight (mg)</th>
        <th>Collaboration</th>
        <th>Total Stock</th>
        <th>Total Sold</th>
        <th>Variant Name</th>
        <th>Stock</th>
        <th>Add. Price</th>
    </tr>
    </thead>
    <tbody>
        @php $no = 1; @endphp
        @foreach ($products as $product)
            @php $rowspan = $product->variants->count(); @endphp
            @foreach ($product->variants as $index => $variant)
                <tr>
                    @if ($index == 0)
                        <td rowspan="{{ $rowspan }}">{{ $no }}</td>
                        <td rowspan="{{ $rowspan }}">{{ $product->name }}</td>
                        <td rowspan="{{ $rowspan }}">{{ $product->description }}</td>
                        <td rowspan="{{ $rowspan }}">{{ $product->category->name }}</td>
                        <td rowspan="{{ $rowspan }}">{{ $product->price }}</td>
                        <td rowspan="{{ $rowspan }}">{{ $product->weight }}</td>
                        <td rowspan="{{ $rowspan }}">{{ $product->collaboration->name ?? '' }}</td>
                        <td rowspan="{{ $rowspan }}">{{ $product->variants->sum('pivot.stock') }}</td>
                        <td rowspan="{{ $rowspan }}">{{ $product->sold }}</td>
                    @endif
                    <td>{{ $variant->name }}</td>
                    <td>{{ $variant->pivot->stock }}</td>
                    <td>{{ $variant->pivot->additionalPrice ?? 0 }}</td>
                </tr>
            @endforeach
            @php $no++; @endphp
        @endforeach
    </tbody>
</table>