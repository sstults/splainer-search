# Project Brief: Splainer Search

## Overview
Splainer Search is an AngularJS library for performing search operations against various search engines including Solr, Elasticsearch, OpenSearch, and Vectara. It provides diagnostic capabilities for search relevance tuning and includes features like highlighting, explain functionality, and result normalization.

## Core Requirements
- Support multiple search engines: Solr (via JSONP), Elasticsearch/OpenSearch (via HTTP/CORS), Vectara (experimental), and Custom Search APIs
- Provide diagnostic tools for relevance tuning (Quepid and Splainer)
- Offer a consistent API across different search engines
- Support highlighting, explain information, and result normalization
- Enable paging through search results

## Goals
- Rewrite the AngularJS-based library to plain JavaScript (ESM) while preserving the public API
- Create a framework-agnostic package usable from Node and modern browsers
- Maintain backward compatibility with existing AngularJS consumers
- Deliver battle-tested, production-ready code
