/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { VIOLATION_PREFIX, POD_PREFIX } from '../Constants';
import converter from 'number-to-words';

export const extractPodNumber = (str: string) => {
  const match = str.match(new RegExp(`${POD_PREFIX}(\\d+)_`));
  return match ? match[1] : '0';
}

export const removePodPrefix = (str: string) => str.replace(new RegExp(`${POD_PREFIX}\\d+_`), '');

export const removeViolationPrefix = (str: string) => str.replace(VIOLATION_PREFIX, '');

export const convertSnakeCaseToCamelCase = (str: string) =>  str.replace(/(?:^|_)(\w)/g, (_, char) => char.toUpperCase());

export const convertNumberToWords = (num: number) => converter.toWords(num)
  .split(' ')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');