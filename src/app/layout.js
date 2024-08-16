// app/layout.js
import '../../src/app/globals.css';
import ToastConfig from './components/ToastConfig';

export const metadata = {
  title: 'Test App',
  description: 'A test application for creating and attempting quizzes.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="container mx-auto p-4 bg-gray-800 ">
        <ToastConfig />
          {children}
        </div>
      </body>
    </html>
  );
}
