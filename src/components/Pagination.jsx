import { useMemo } from 'react'

export default function Pagination({
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
  limitOptions = [10, 20, 50],
}) {
  const totalPages = useMemo(() => {
    if (!total && total !== 0) return null
    return Math.max(1, Math.ceil(total / limit))
  }, [total, limit])

  const canPrev = page > 1
  const canNext = totalPages ? page < totalPages : true

  return (
    <div className="pagination">
      <div className="pagination-left">
        <button
          className="btn btn-ghost"
          type="button"
          onClick={() => onPageChange?.(1)}
          disabled={!canPrev}
        >
          First
        </button>
        <button
          className="btn btn-ghost"
          type="button"
          onClick={() => onPageChange?.(page - 1)}
          disabled={!canPrev}
        >
          Prev
        </button>

        <div className="pagination-info">
          Page <b>{page}</b>
          {totalPages ? (
            <>
              {' '}
              of <b>{totalPages}</b>
            </>
          ) : null}
        </div>

        <button
          className="btn btn-ghost"
          type="button"
          onClick={() => onPageChange?.(page + 1)}
          disabled={!canNext}
        >
          Next
        </button>
      </div>

      <div className="pagination-right">
        {typeof total === 'number' ? (
          <div className="pagination-total">
            Total: <b>{total}</b>
          </div>
        ) : null}

        <label className="pagination-limit">
          <span>Rows</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange?.(Number(e.target.value))}
          >
            {limitOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}

