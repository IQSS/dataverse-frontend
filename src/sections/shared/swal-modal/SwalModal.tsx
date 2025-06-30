import Swal, { SweetAlertOptions } from 'sweetalert2'
import withReactContent, { ReactSweetAlert, SweetAlert2 } from 'sweetalert2-react-content'

/**
 * This is a custom implementation of the Swal modal.
 * We use this to have a consistent look and feel across the application, applying custom styles so it matches bootstrap modals styles.
 * It also uses sweetalert2-react-content to allow passing react nodes as properties.
 * More documentation on how to use Swal library can be found here: https://sweetalert2.github.io/
 */

const SwalWithReactContent = withReactContent(Swal)

const defaultSwalOptions: SweetAlertOptions = {
  buttonsStyling: false,
  reverseButtons: true,
  customClass: {
    popup: 'swal-popup-custom',
    title: 'swal-title-custom',
    htmlContainer: 'swal-html-container-custom',
    actions: 'swal-actions-custom',
    confirmButton: 'btn btn-primary',
    denyButton: 'btn btn-secondary',
    cancelButton: 'btn btn-secondary'
  }
}

export const SwalModal = SwalWithReactContent.mixin(defaultSwalOptions) as SweetAlert2 &
  ReactSweetAlert

export const SwalModalWithModifiedCustomClass = (customClass: SweetAlertOptions['customClass']) => {
  return SwalWithReactContent.mixin({
    ...defaultSwalOptions,
    customClass: {
      ...defaultSwalOptions.customClass,
      ...customClass
    }
  }) as SweetAlert2 & ReactSweetAlert
}
