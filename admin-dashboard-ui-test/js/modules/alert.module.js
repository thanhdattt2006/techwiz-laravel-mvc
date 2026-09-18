/**
 * Module: AlertModule
 * Tuân thủ Single Responsibility & DRY: Đóng gói SweetAlert2 (Toast, Alert, Confirm) chuẩn theme
 */
export class AlertModule {
    /**
     * Bắn Toast notification ở góc màn hình (tự tắt sau 3s)
     * @param {'success'|'error'|'warning'|'info'} icon
     * @param {string} title
     */
    static showToast(icon = 'success', title = 'Thao tác thành công') {
        if (!window.Swal) {
            alert(title);
            return;
        }

        const Toast = window.Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', window.Swal.stopTimer);
                toast.addEventListener('mouseleave', window.Swal.resumeTimer);
            }
        });

        Toast.fire({
            icon: icon,
            title: title
        });
    }

    /**
     * Popup xác nhận hành động nguy hiểm (Confirm Dialog)
     * @param {Object} options
     * @param {string} options.title
     * @param {string} options.text
     * @param {string} options.confirmText
     * @param {string} options.cancelText
     * @returns {Promise<boolean>}
     */
    static async confirmAction({
        title = 'Bạn có chắc chắn?',
        text = 'Thao tác này không thể hoàn tác!',
        confirmText = 'Đồng ý, xoá ngay',
        cancelText = 'Huỷ bỏ'
    } = {}) {
        if (!window.Swal) {
            return window.confirm(`${title}\n${text}`);
        }

        const result = await window.Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f43f5e', // Rose 500
            cancelButtonColor: '#64748b',  // Slate 500
            confirmButtonText: confirmText,
            cancelButtonText: cancelText,
            reverseButtons: true,
            customClass: {
                popup: 'rounded-2xl dark:bg-slate-900 dark:text-white',
                title: 'text-slate-900 dark:text-white font-bold',
                htmlContainer: 'text-slate-500 dark:text-slate-400'
            }
        });

        return result.isConfirmed;
    }
}
