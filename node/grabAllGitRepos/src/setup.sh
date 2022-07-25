BASEDIR=$(dirname $0)
TESTDIR=${1:-$BASEDIR/test}

FOO_PATH=$TESTDIR/foo
BAZ_PATH=$TESTDIR/bar/baz
QUX_PATH=$TESTDIR/qux

mkdir -p $FOO_PATH $BAZ_PATH $QUX_PATH

pushd $FOO_PATH > /dev/null
git init -q
git remote add origin git@github.com:Chris56974/node-scripts.git
popd > /dev/null

pushd $BAZ_PATH > /dev/null
git init -q
git remote add origin git@github.com:Chris56974/node-scripts.git
popd > /dev/null
