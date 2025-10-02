import { createRoute } from 'honox/factory'
import Counter from './$counter'
import { Suspense } from 'hono/jsx'
import { css } from 'hono/css'
import Time from '../islands/time'

const className = css`
  font-family: sans-serif;
  color: blue;
`

const Component = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  return <div>Bomb!!</div>
}


export default createRoute((c) => {
  const name = c.req.query('name') ?? 'I’m tokec'
  return c.render(
    <div class="py-8 text-center">
      <title>{name}</title>
      <h1 class="text-3xl font-bold">Hello, {name}!</h1>
      <Counter />
        <div class="py-8 text-2xl font-bold ">
          <Time />
        </div>
      <Suspense fallback={<div>Loading...</div>}>
        <div class={className}>
        <Component />
        </div>
      </Suspense>
      
    </div>
  )
})
