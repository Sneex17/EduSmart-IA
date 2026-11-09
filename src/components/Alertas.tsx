import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const AlertaMensaje = withReactContent(Swal);
type MensajeProps = {
    title: string;
    texto: string;
    icono: any;
    confirmacion: string;
}
export const MensajeAvisos = ({title, texto, icono, confirmacion } : MensajeProps) =>
  AlertaMensaje.fire({
    title: title,
    text: texto,
    icon: icono,
    confirmButtonText: confirmacion,
  });
