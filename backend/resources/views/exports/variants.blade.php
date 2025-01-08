<table>
    <thead>
    <tr>
        <th>No</th>
        <th>Variant</th>
        <th>Type</th>
        <th>Created At</th>
    </tr>
    </thead>
    <tbody>
    @foreach($variants as $variant)
        <tr>
            <td>{{ $loop->iteration }}</td>
            <td>{{ $variant->name }}</td>
            <td>{{ $variant->type }}</td>
            <td>{{ $variant->created_at }}</td>
        </tr>
    @endforeach
    </tbody>
</table>