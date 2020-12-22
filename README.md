[![Travis-CI Status](https://travis-ci.com/anevis/datadog-to-terraform-js.svg?branch=master)](https://travis-ci.com/anevis/datadog-to-terraform-js)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=anevis_datadog-to-terraform-js&metric=alert_status)](https://sonarcloud.io/dashboard?id=anevis_datadog-to-terraform-js)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=anevis_datadog-to-terraform-js&metric=coverage)](https://sonarcloud.io/dashboard?id=anevis_datadog-to-terraform-js)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=anevis_datadog-to-terraform-js&metric=bugs)](https://sonarcloud.io/dashboard?id=anevis_datadog-to-terraform-js)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=anevis_datadog-to-terraform-js&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=anevis_datadog-to-terraform-js)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=anevis_datadog-to-terraform-js&metric=security_rating)](https://sonarcloud.io/dashboard?id=anevis_datadog-to-terraform-js)

# Datadog to Terraform Converter (JS)

This application converts a given Datadog JSON exported using the Datadog UI into
[Terraform Datadog provider](https://www.terraform.io/docs/providers/datadog/r/dashboard.html) format.

## Terraform Datadog provider

Version: **2.18.1**

### Supported Resources

-   Datadog Dashboard

## Pre-requisites

The following tools and pre-requisites must be available on the machine being used:

-   `Node.js` Version > 10.19.0
-   `npm` Version > 6.13.4
-   `Yarn` Version > 1.22.5
-   `Docker` Version > 20.10.1
-   `Bash` Version > 4.4.20(1)-release

See [package.json](package.json) for all runtime and dev dependencies

## Known Issues

### Log Query multi-compute

N/A

## Licence

Apache License Version 2.0, January 2004 (See the included [Licence](LICENSE) file for more information).

## Trademark Disclaimer

Please note this project is NOT in anyway sponsored or endorsed by Datadog. Inc. or HashiCorp. Inc.

-   Datadog is a trademark of [Datadog, Inc.](https://www.datadoghq.com/)
-   Terraform is a trademark of [HashiCorp, Inc.](https://www.terraform.io/)
