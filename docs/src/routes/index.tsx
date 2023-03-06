import Counter from '~/components/Counter';

export default function Home() {
  return (
    <main>
      <h1>Hello world!</h1>
      <Counter />
      <p>
        Visit{' '}
        <a href="https://aiabit.com" target="_blank" rel="noopener">
          aiabit.com
        </a>{' '}
        to learn how to build Abitjs apps.
      </p>
    </main>
  );
}
