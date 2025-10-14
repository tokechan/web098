import { createRoute } from 'honox/factory';
import { HomePage } from '../components/templates/HomePage';
import { getRecentPosts } from '../lib/posts';
import { labsProjects } from '../lib/projects';

export default createRoute((c) => {
  const latestPosts = getRecentPosts(3);
  return c.render(
    <HomePage
      latestPosts={latestPosts}
      projects={labsProjects}
      showClock
    />
  );
});
