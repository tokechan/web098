import { css, cx } from 'hono/css';
import type { FC } from 'hono/jsx';
import { useRequestContext } from 'hono/jsx-renderer';
import Time from '../islands/time';

<div class="py-8 text-center">
<h1 class="text-3xl font-bold">Hello! honox</h1>
<p>✏️blog+小さなWebサービスの実験場🧪</p>
<Time />
</div>