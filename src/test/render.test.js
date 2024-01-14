import { expect, test, describe } from 'vitest'
import React from '../core/react-dom/React'

describe('render', () => {
    test('createElement', () => {
        const app = React.createElement(
            "div", 
            { id: 'app' },
            'mini',
            'react'
        )
        expect(app).toEqual({
            type: 'div',
            props: {
                id: 'app',
                children: [
                    {
                        type: "TEXT",
                        props: {
                            nodeValue: "mini",
                           children: []
                        }
                    },
                    {
                        type: "TEXT",
                        props: {
                            nodeValue: "react",
                           children: []
                        }
                    }
                ]
            }
        })
    })
})