#!/usr/bin/env node
'use strict';
import { cli, handleError } from '../dist/cli.mjs';

cli().catch(handleError);
