<table>
    <thead>
    <tr>
        <th>No</th>
        <th>Brand Name</th>
        <th>Created At</th>
    </tr>
    </thead>
    <tbody>
    @foreach($collaborations as $collaboration)
        <tr>
            <td>{{ $loop->iteration }}</td>
            <td>{{ $collaboration->name }}</td>
            <td>{{ $collaboration->created_at }}</td>
        </tr>
    @endforeach
    </tbody>
</table>