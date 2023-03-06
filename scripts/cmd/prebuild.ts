export async function build(..._args: string[]) {
  // console.log(args);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
