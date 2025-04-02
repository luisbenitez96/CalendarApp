import { useMemo, useState } from "react";
import { addHours, differenceInSeconds } from "date-fns";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import Modal from "react-modal";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale/es";
import { useUiStore } from "../../hooks";

registerLocale("es", es);

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

export const CalendarModal = () => {
  const { isDateModalOpen, closeDateModal } = useUiStore();

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formValues, setFormValues] = useState({
    title: "Luis",
    notes: "Benitez",
    start: new Date(),
    end: addHours(new Date(), 1), // Fecha de fin inicializada correctamente
  });

  const titleClass = useMemo(() => {
    if (!formSubmitted) return ""; // Si no se ha enviado el formulario, no hay clase
    return formValues.title.length > 0 ? "is-valid" : "is-invalid"; // Si el título está vacío, agrega la clase is-invalid
  }); // Dependencias para el efecto

  const onInputChange = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value, // Actualiza el valor del campo que se está cambiando
    });
  };

  const onDateChange = (event, changing) => {
    setFormValues({
      ...formValues,
      [changing]: event,
    });
  };

  const onCloseModal = () => {
    closeDateModal();
  };

  const onSubmit = (event) => {
    event.preventDefault(); // Previene el comportamiento por defecto del formulario
    setFormSubmitted(true); // Marca el formulario como enviado

    const difference = differenceInSeconds(formValues.end, formValues.start);
    if (isNaN(difference) || difference <= 0) {
      // Verifica si la diferencia es válida
      Swal.fire("Fechas incorrectas", "Revisar las fechas ingresadas", "error");
      console.log("Error en fechas ");
      return;
    }
    if (formValues.title.length <= 0) return;
    console.log(formValues);

    // TODO:
    // cerrar el modal
    // remover errores en pantalla
  };

  return (
    <>
      <Modal
        isOpen={isDateModalOpen} // Controla si el modal está abierto
        onRequestClose={onCloseModal} // Cierra el modal al hacer clic fuera o presionar ESC
        style={customStyles}
        className="modal"
        overlayClassName="modal-fondo" // Clase para el fondo del modal
        closeTimeoutMS={200} // Tiempo de cierre del modal
      >
        <h1> Nuevo evento </h1>
        <hr />
        <form className="container" onSubmit={onSubmit}>
          <div className="form-group mb-2">
            <label>Fecha y hora inicio</label>
            <br />
            <DatePicker
              selected={formValues.start}
              onChange={(event) => onDateChange(event, "start")}
              className="form-control"
              dateFormat="Pp"
              showTimeSelect
              locale={"es"}
              timeCaption="Hora"
            />
          </div>

          <div className="form-group mb-2">
            <label>Fecha y hora fin</label>
            <br />
            <DatePicker
              minDate={formValues.start}
              selected={formValues.end}
              onChange={(event) => onDateChange(event, "end")}
              className="form-control"
              dateFormat="Pp"
              showTimeSelect
              locale={"es"}
              timeCaption="Hora"
            />
          </div>

          <hr />
          <div className="form-group mb-2">
            <label>Titulo y notas</label>
            <input
              type="text"
              className={`form-control ${titleClass}`}
              placeholder="Título del evento"
              name="title"
              autoComplete="off"
              value={formValues.title}
              onChange={onInputChange}
            />
            <small id="emailHelp" className="form-text text-muted">
              Una descripción corta
            </small>
          </div>

          <div className="form-group mb-2">
            <textarea
              type="text"
              className="form-control"
              placeholder="Notas"
              rows="5"
              name="notes"
              value={formValues.notes}
              onChange={onInputChange}></textarea>
            <small id="emailHelp" className="form-text text-muted">
              Información adicional
            </small>
          </div>

          <button type="submit" className="btn btn-outline-primary btn-block">
            <i className="far fa-save"></i>
            <span> Guardar</span>
          </button>
        </form>
      </Modal>
    </>
  );
};
