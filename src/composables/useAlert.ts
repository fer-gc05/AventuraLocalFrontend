import Swal from 'sweetalert2';

export const useAlert = () => {
  const success = async (message: string) => {
    await Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: message,
      timer: 2000,
      showConfirmButton: false
    });
  };

  const error = async (message: string) => {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message
    });
  };

  const loading = async (message: string) => {
    await Swal.fire({
      title: message,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  };

  const confirm = async (title: string, text: string) => {
    const result = await Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
    });

    return result.isConfirmed;
  };

  return {
    success,
    error,
    loading,
    confirm
  };
}; 