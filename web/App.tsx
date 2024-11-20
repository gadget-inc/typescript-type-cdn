import { useEffect } from "react";
import "./App.css";

const Example = (props: { href: string }) => {
  return <span>
    Example:&nbsp;
    <a href={props.href}><code>{props.href}</code></a>
  </span>
};

const App = () => {
  useEffect(() => {
    document.title = `Home - ${process.env.GADGET_PUBLIC_APP_SLUG} - Gadget`;
  }, []);

  return (
    <main>
      <a href="https://gadget.dev" className="logo">
        <img src="https://assets.gadget.dev/assets/icon.svg" height="52" alt="Gadget" />
      </a>
      <h1>Gadget TypeScript CDN!</h1>
      <p>
        This Gadget application serves condensed TypeScript types for packages from NPM.
      </p>
      <h2>API</h2>
      <p>
        <ul>
          <li>
            <code>GET /types/package/&lt;package&gt;@&lt;version&gt;</code> - Get all the types for a given <code>package</code> at a given <code>version</code>
            <br /><Example href="/types/package/got@11.0.0" />
          </li>
          <li>
            <code>GET /types/group?packages=&lt;package&gt;@&lt;version&gt;,&lt;package&gt;@&lt;version&gt;</code> - Get all the types for a list of <code>packages</code> at a given <code>versions</code>
            <br /><Example href="/types/group?packages=got@11.0.0,lodash@4.0.0" />
          </li>
        </ul>
      </p>
    </main>
  );
};

export default App;
