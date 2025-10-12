import './styles.css';
import './styles/global.css';
import { PropsWithChildren } from 'hono/jsx';

export default function Layout({ children }: PropsWithChildren) {
    return (
        <html lang="ja">
            <body>
                {children}
            </body>
        </html>
    )
}

