import React from 'react'

const PaginationInfo = ({ currentPage, perPage, totalEntries }) => {
    const start = totalEntries > 0 ? ((currentPage - 1) * perPage + 1) : 0
    const end = Math.min(currentPage * perPage, totalEntries)

    return (
        <span className="text-sm">
            Showing {start} to {end} of {totalEntries} entries
        </span>
    )
}

export default PaginationInfo