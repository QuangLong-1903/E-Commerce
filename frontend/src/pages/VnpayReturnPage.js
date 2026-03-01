import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import MainLayout from '../components/layouts/MainLayout';
import Loading from '../components/common/Loading';

const VnpayReturnPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const processVnpayReturn = () => {
      // backend already verified hash and updated order
      const success = searchParams.get('success');
      const code = searchParams.get('code');
      const err = searchParams.get('error');

      if (success === 'true') {
        setStatus('success');
        toast.success('Thanh toán thành công!');
        setTimeout(() => navigate('/orders'), 3000);
      } else {
        setStatus('failed');
        if (err) {
          toast.error(`Lỗi: ${err}`);
        } else if (code) {
          toast.error(`Thanh toán thất bại! Mã lỗi: ${code}`);
        } else {
          toast.error('Thanh toán thất bại');
        }
        setTimeout(() => navigate('/checkout'), 3000);
      }
    };

    processVnpayReturn();
  }, [searchParams, navigate]);

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <Loading />
              <p className="mt-4 text-gray-600">Đang xử lý thanh toán...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Thanh toán thành công!
              </h1>
              <p className="text-gray-600 mb-6">
                Đơn hàng của bạn đã được tạo. Chúng tôi sẽ chuyển hướng bạn trong 3 giây...
              </p>
              <button
                onClick={() => navigate('/orders')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Xem đơn hàng ngay
              </button>
            </>
          )}

          {status === 'failed' && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Thanh toán thất bại
              </h1>
              <p className="text-gray-600 mb-6">
                Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.
              </p>
              <button
                onClick={() => navigate('/checkout')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Quay lại checkout
              </button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Lỗi xử lý
              </h1>
              <p className="text-gray-600 mb-6">
                Có lỗi xảy ra khi xử lý thanh toán.
              </p>
              <button
                onClick={() => navigate('/checkout')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Quay lại checkout
              </button>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default VnpayReturnPage;
