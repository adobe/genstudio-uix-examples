#! /bin/bash


echo "Deploying to GS Engineering 01 in stage environment"
export AIO_CLI_ENV=stage
aio login --force

echo "Deploying genstudio-mlr-claims-app app"
cd genstudio-mlr-claims-app/
aio console ws download --orgId 36031A56669DEACD0A49402F@AdobeOrg --projectId 4566206088344816822 --workspaceId 4566206088344817194
aio app use ./console.json -m
aio app build --force-build
aio app deploy --force-deploy
rm -rf console.json

echo "Deploying genstudio-create-validation app"
cd ../genstudio-create-validation/
aio console ws download --orgId 36031A56669DEACD0A49402F@AdobeOrg --projectId 4566206088344814342 --workspaceId 4566206088344814631
aio app use ./console.json -m
aio app build --force-build
aio app deploy --force-deploy
rm -rf console.json

echo "Deploying to PAT04 in production environment"
export AIO_CLI_ENV=prod
aio login --force

echo "Deploying genstudio-mlr-claims-app app"
cd ../genstudio-mlr-claims-app/
aio console ws download --orgId 431F1E0866F5EDAD0A495FFC@AdobeOrg --projectId 4566206088345338770 --workspaceId 4566206088345358709
aio app use ./console.json -m
aio app build --force-build
aio app deploy --force-deploy
rm -rf console.json

echo "Deploying genstudio-create-validation app"
cd ../genstudio-create-validation/
aio console ws download --orgId 431F1E0866F5EDAD0A495FFC@AdobeOrg --projectId 4566206088345331861 --workspaceId 4566206088345351438
aio app use ./console.json -m
aio app build --force-build
aio app deploy --force-deploy
rm -rf console.json
cd ../