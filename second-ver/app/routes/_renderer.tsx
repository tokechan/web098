import { jsxRenderer } from 'hono/jsx-renderer';
import Document from '../Layout';

export default jsxRenderer(({ children, title }) => (
  <Document title={title}>{children}</Document>
));
