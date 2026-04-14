function EstadoError({ titulo = 'Ocurrió un error', mensaje, onReintentar }) {
  return (
    <div className="estado-error">
      <div className="estado-error-icono">⚠️</div>
      <h3>{titulo}</h3>
      <p>{mensaje}</p>

      {onReintentar && (
        <button type="button" className="boton" onClick={onReintentar}>
          Reintentar
        </button>
      )}
    </div>
  )
}

export default EstadoError