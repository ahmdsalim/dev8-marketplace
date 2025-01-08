<table>
    <thead>
    <tr>
        <th>No</th>
        <th>Category</th>
        <th>Description</th>
        <th>Created At</th>
    </tr>
    </thead>
    <tbody>
    @foreach($categories as $category)
        <tr>
            <td>{{ $loop->iteration }}</td>
            <td>{{ $category->name }}</td>
            <td>{{ $category->description }}</td>
            <td>{{ $category->created_at }}</td>
        </tr>
    @endforeach
    </tbody>
</table>