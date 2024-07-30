import { assertType, expectTypeOf, test } from 'vitest'
import { openai } from './openai'

test('Argument type of openai function', () => {
    expectTypeOf(openai).toBeFunction()
    expectTypeOf(openai).parameter(0).toMatchTypeOf<string>()
    
    assertType(openai("test"))
  })