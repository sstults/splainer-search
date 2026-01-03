export const bigHonkinExplain = {
  match: true,
  value: 63.28156,
  description: 'sum of:',
  details: [
    {
      match: true,
      value: 0.64492244,
      description: 'sum of:',
      details: [
        {
          match: true,
          value: 0.055089835,
          description: 'max plus 1.0 times others of:',
          details: [
            {
              match: true,
              value: 0.055089835,
              description: 'weight(text_all:datum^30.0 in 3113) [LucidMultiLenNormSimilarity], result of:',
              details: [
                {
                  match: true,
                  value: 0.055089835,
                  description: 'score(doc=3113,freq=11.0 = termFreq=11.0\n), product of:',
                  details: [
                    {
                      match: true,
                      value: 0.008519179,
                      description: 'queryWeight, product of:',
                      details: [
                        {
                          match: true,
                          value: 30,
                          description: 'boost'
                        },
                        {
                          match: true,
                          value: 1.9497429,
                          description: 'idf(docFreq=157592, maxDocs=407385)'
                        },
                        {
                          match: true,
                          value: 0.0001456462,
                          description: 'queryNorm'
                        }
                      ]
                    },
                    {
                      match: true,
                      value: 6.466566,
                      description: 'fieldWeight in 3113, product of:',
                      details: [
                        {
                          match: true,
                          value: 3.3166249,
                          description: 'tf(freq=11.0), with freq of:',
                          details: [
                            {
                              match: true,
                              value: 11,
                              description: 'termFreq=11.0'
                            }
                          ]
                        },
                        {
                          match: true,
                          value: 1.9497429,
                          description: 'idf(docFreq=157592, maxDocs=407385)'
                        },
                        {
                          match: true,
                          value: 1,
                          description: 'fieldNorm(doc=3113)'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          match: true,
          value: 0.29639143,
          description: 'max plus 1.0 times others of:',
          details: [
            {
              match: true,
              value: 0.29639143,
              description: 'weight(text_all:science^30.0 in 3113) [LucidMultiLenNormSimilarity], result of:',
              details: [
                {
                  match: true,
                  value: 0.29639143,
                  description: 'score(doc=3113,freq=10.0 = termFreq=10.0\n), product of:',
                  details: [
                    {
                      match: true,
                      value: 0.020236855,
                      description: 'queryWeight, product of:',
                      details: [
                        {
                          match: true,
                          value: 30,
                          description: 'boost'
                        },
                        {
                          match: true,
                          value: 4.63151,
                          description: 'idf(docFreq=10785, maxDocs=407385)'
                        },
                        {
                          match: true,
                          value: 0.0001456462,
                          description: 'queryNorm'
                        }
                      ]
                    },
                    {
                      match: true,
                      value: 6.466566,
                      description: 'fieldWeight in 3113, product of:',
                      details: [
                        {
                          match: true,
                          value: 3.3166249,
                          description: 'tf(freq=10.0), with freq of:',
                          details: [
                            {
                              match: true,
                              value: 10,
                              description: 'termFreq=10.0'
                            }
                          ]
                        },
                        {
                          match: true,
                          value: 4.63151,
                          description: 'idf(docFreq=10785, maxDocs=407385)'
                        },
                        {
                          match: true,
                          value: 1,
                          description: 'fieldNorm(doc=3113)'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
