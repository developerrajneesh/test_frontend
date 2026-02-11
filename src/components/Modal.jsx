import { useEffect } from 'react'

export default function Modal({
  title,
  isOpen,
  onClose,
  children,
  footer = null,
  closeOnBackdrop = true,
  closeOnEsc = true,
}) {
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, closeOnEsc, onClose])

  if (!isOpen) return null

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (!closeOnBackdrop) return
        if (e.target === e.currentTarget) onClose?.()
      }}
    >
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button className="btn btn-ghost" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <div className="modal-body">{children}</div>

        {footer ? <div className="modal-footer">{footer}</div> : null}
      </div>
    </div>
  )
}

